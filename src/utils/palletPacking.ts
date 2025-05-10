import { Container, Pallet, Dimensions, Position } from '../types/types';

// Константа для погрешности вычислений
// Используется для компенсации ошибок округления в операциях с плавающей точкой
const EPSILON = 0.001;

/**
 * Интерфейс для описания пространства в контейнере
 * Используется для поиска свободных мест и проверки пересечений
 */
interface Space {
  x: number;      // Координата начала пространства по X
  y: number;      // Координата начала пространства по Y
  z: number;      // Координата начала пространства по Z
  width: number;  // Ширина пространства
  height: number; // Высота пространства
  depth: number;  // Глубина пространства
}

/**
 * Функция для получения возможных ориентаций паллеты
 * Возвращает массив всех допустимых поворотов паллеты в пространстве
 * @param dimensions - Размеры паллеты
 * @returns Массив возможных ориентаций
 */
export function getPalletOrientations(dimensions: { width: number; height: number; depth: number }): Array<{ width: number; height: number; depth: number }> {
  const { width, height, depth } = dimensions;
  return [
    // Стандартные ориентации (стоя)
    { width, height, depth },
    { width: depth, height, depth: width },
    
    // Положение на боку (по Z)
    { width, height: depth, depth: height },
    { width: depth, height: depth, depth: height },
    
    // Положение на торце (по X)
    { width: height, height: width, depth },
    { width: height, height: depth, depth: width }
  ];
}

/**
 * Функция для проверки пересечений двух пространств
 * Используется для определения возможности размещения паллет
 * @param space1 - Первое пространство
 * @param space2 - Второе пространство
 * @returns true если пространства пересекаются, false если нет
 */
export function checkIntersection(space1: Space, space2: Space): boolean {
  return !(
    space1.x + space1.width <= space2.x ||
    space1.x >= space2.x + space2.width ||
    space1.y + space1.height <= space2.y ||
    space1.y >= space2.y + space2.height ||
    space1.z + space1.depth <= space2.z ||
    space1.z >= space2.z + space2.depth
  );
}

/**
 * Функция для проверки возможности размещения паллеты
 * Проверяет границы контейнера и пересечения с другими паллетами
 * @param position - Позиция для проверки
 * @param dimensions - Размеры паллеты
 * @param container - Контейнер
 * @param placedPallets - Массив уже размещенных паллет
 * @returns true если размещение возможно, false если нет
 */
function canPlace(
  position: Position,
  dimensions: { width: number; height: number; depth: number },
  container: Container,
  placedPallets: Pallet[]
): boolean {
  // Проверяем границы контейнера с учетом погрешности
  if (
    position.x + dimensions.width > container.dimensions.width + EPSILON ||
    position.y + dimensions.height > container.dimensions.height + EPSILON ||
    position.z + dimensions.depth > container.dimensions.depth + EPSILON ||
    position.x < -EPSILON || position.y < -EPSILON || position.z < -EPSILON
  ) {
    return false;
  }

  // Проверяем пересечения с уже размещенными паллетами
  const newSpace: Space = {
    ...position,
    ...dimensions
  };

  return !placedPallets.some(pallet =>
    checkIntersection(newSpace, {
      ...pallet.position,
      ...pallet.dimensions
    })
  );
}

/**
 * Основная функция размещения паллет
 * Использует послойный алгоритм заполнения контейнера
 * Пытается разместить паллеты в различных ориентациях для максимального использования пространства
 * @param container - Контейнер для размещения
 * @param palletDimensions - Размеры паллет
 * @returns Массив размещенных паллет с их позициями и ориентациями
 */
export function placePallets(container: Container, palletDimensions: { width: number; height: number; depth: number }): Pallet[] {
  const placedPallets: Pallet[] = [];
  // Получаем все возможные ориентации паллет и сортируем их по ширине
  const orientations = getPalletOrientations(palletDimensions);
  const sortedOrientations = [...orientations].sort((a, b) => a.width - b.width);

  // Перебираем слои по высоте
  for (let y = 0; y <= container.dimensions.height - palletDimensions.height; y += palletDimensions.height) {
    let x = 0;
    
    // Перебираем позиции по ширине
    while (x <= container.dimensions.width - Math.min(palletDimensions.width, palletDimensions.depth)) {
      let z = 0;
      
      // Перебираем позиции по глубине
      while (z <= container.dimensions.depth - palletDimensions.depth) {
        let placed = false;
        
        // Пробуем разместить паллету в каждой возможной ориентации
        for (const orientation of sortedOrientations) {
          if (x + orientation.width <= container.dimensions.width) {
            const position = { x, y, z };
            
            // Если паллету можно разместить в данной позиции и ориентации
            if (canPlace(position, orientation, container, placedPallets)) {
              placedPallets.push({
                dimensions: orientation,
                position: position,
                weight: 30
              });
              placed = true;
              z += orientation.depth;
              break;
            }
          }
        }
        
        // Если не удалось разместить паллету, корректируем позицию
        if (!placed) {
          if (z === 0) {
            x += Math.min(palletDimensions.width, palletDimensions.depth);
            break;
          } else {
            break;
          }
        }
      }
      
      // Корректируем позицию по ширине для следующей итерации
      if (z === 0) {
        x += Math.min(palletDimensions.width, palletDimensions.depth);
      } else if (placedPallets.length > 0) {
        const firstInRow = placedPallets.find(p => p.position.x === x && p.position.y === y);
        if (firstInRow) {
          x += firstInRow.dimensions.width;
        }
      }
    }
  }

  return placedPallets;
} 