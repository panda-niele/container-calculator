import { Container, Pallet, Box, Dimensions, Position } from '../types/types';
import { checkIntersection } from './palletPacking';

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
 * Функция для получения возможных ориентаций ящика
 * Возвращает массив всех допустимых поворотов ящика в пространстве
 * @param dimensions - Размеры ящика
 * @returns Массив возможных ориентаций
 */
export function getBoxOrientations(dimensions: { width: number; height: number; depth: number }): Array<{ width: number; height: number; depth: number }> {
  const { width, height, depth } = dimensions;
  return [
    { width, height, depth },
    { width: depth, height, depth: width },
    { width: height, height: width, depth }
  ];
}

/**
 * Функция для проверки пересечений с паллетами и другими ящиками
 * @param position - Проверяемая позиция
 * @param dimensions - Размеры ящика
 * @param placedPallets - Размещенные паллеты
 * @param placedBoxes - Размещенные ящики
 * @returns true если есть пересечения, false если нет
 */
function hasIntersections(
  position: Position,
  dimensions: Dimensions,
  placedPallets: Pallet[],
  placedBoxes: Box[]
): boolean {
  const newSpace = { ...position, ...dimensions };
  
  // Проверяем пересечения с паллетами
  const intersectsWithPallets = placedPallets.some(pallet =>
    checkIntersection(newSpace, {
      ...pallet.position,
      ...pallet.dimensions
    })
  );
  
  if (intersectsWithPallets) return true;
  
  // Проверяем пересечения с другими ящиками
  return placedBoxes.some(box =>
    checkIntersection(newSpace, {
      ...box.position,
      ...box.dimensions
    })
  );
}

/**
 * Функция для нахождения боковых пространств
 * Ищет свободные пространства по бокам от размещенных паллет
 * @param container - Контейнер
 * @param placedPallets - Размещенные паллеты
 * @returns Массив найденных пространств
 */
function findSideSpaces(container: Container, placedPallets: Pallet[]): Space[] {
  // Находим крайние точки размещения паллет по X
  const palletXRanges = placedPallets.map(pallet => ({
    start: pallet.position.x,
    end: pallet.position.x + pallet.dimensions.width
  }));

  // Сортируем паллеты по X координате
  palletXRanges.sort((a, b) => a.start - b.start);

  const spaces: Space[] = [];

  // Добавляем пространство слева от первой паллеты
  if (palletXRanges.length > 0 && palletXRanges[0].start > EPSILON) {
    spaces.push({
      x: 0,
      y: 0,
      z: 0,
      width: palletXRanges[0].start,
      height: container.dimensions.height,
      depth: container.dimensions.depth
    });
  }

  // Добавляем пространства между паллетами
  for (let i = 0; i < palletXRanges.length - 1; i++) {
    const gap = palletXRanges[i + 1].start - palletXRanges[i].end;
    if (gap > EPSILON) {
      spaces.push({
        x: palletXRanges[i].end,
        y: 0,
        z: 0,
        width: gap,
        height: container.dimensions.height,
        depth: container.dimensions.depth
      });
    }
  }

  // Добавляем пространство справа от последней паллеты
  if (palletXRanges.length > 0) {
    const lastPalletEnd = palletXRanges[palletXRanges.length - 1].end;
    if (lastPalletEnd < container.dimensions.width - EPSILON) {
      spaces.push({
        x: lastPalletEnd,
        y: 0,
        z: 0,
        width: container.dimensions.width - lastPalletEnd,
        height: container.dimensions.height,
        depth: container.dimensions.depth
      });
    }
  }

  return spaces;
}

/**
 * Функция для нахождения пространства над паллетами
 * Ищет свободное пространство над размещенными паллетами
 * @param container - Контейнер
 * @param placedPallets - Размещенные паллеты
 * @returns Массив найденных пространств
 */
function findSpacesAbovePallets(container: Container, placedPallets: Pallet[]): Space[] {
  if (placedPallets.length === 0) return [];

  // Находим максимальную высоту паллет
  const maxPalletHeight = Math.max(...placedPallets.map(pallet => 
    pallet.position.y + pallet.dimensions.height
  ));

  // Находим крайние точки размещения паллет по X
  const palletXRanges = placedPallets.map(pallet => ({
    start: pallet.position.x,
    end: pallet.position.x + pallet.dimensions.width
  }));

  // Сортируем паллеты по X координате
  palletXRanges.sort((a, b) => a.start - b.start);

  // Находим общие границы по X
  const minX = Math.min(...palletXRanges.map(range => range.start));
  const maxX = Math.max(...palletXRanges.map(range => range.end));

  // Создаем одно большое пространство над всеми паллетами
  // Используем всю глубину контейнера
  const spaceAbove: Space = {
    x: minX,
    y: maxPalletHeight,
    z: 0,
    width: maxX - minX,
    height: container.dimensions.height - maxPalletHeight,
    depth: container.dimensions.depth
  };

  // Добавляем пространство только если есть место над паллетами
  return spaceAbove.height > EPSILON ? [spaceAbove] : [];
}

/**
 * Основная функция размещения ящиков
 * Размещает ящики в свободных пространствах контейнера
 * @param container - Контейнер
 * @param boxDimensions - Размеры ящиков
 * @param placedPallets - Размещенные паллеты
 * @returns Массив размещенных ящиков с их позициями
 */
export function placeBoxes(
  container: Container,
  boxDimensions: { width: number; height: number; depth: number },
  placedPallets: Pallet[]
): Box[] {
  const placedBoxes: Box[] = [];
  const orientations = getBoxOrientations(boxDimensions);

  // Находим все пространства по бокам и над паллетами
  const sideSpaces = findSideSpaces(container, placedPallets);
  const aboveSpaces = findSpacesAbovePallets(container, placedPallets);
  const allSpaces = [...sideSpaces, ...aboveSpaces];

  // Для каждого пространства пытаемся разместить ящики
  allSpaces.forEach(space => {
    // Размещаем ящики в текущем пространстве
    for (let y = space.y; y <= space.y + space.height - boxDimensions.height; y += boxDimensions.height) {
      for (let x = space.x; x <= space.x + space.width - boxDimensions.width; x += boxDimensions.width) {
        for (let z = space.z; z <= space.z + space.depth - boxDimensions.depth; z += boxDimensions.depth) {
          // Пробуем каждую ориентацию ящика
          for (const orientation of orientations) {
            if (
              x + orientation.width <= space.x + space.width &&
              y + orientation.height <= space.y + space.height &&
              z + orientation.depth <= space.z + space.depth
            ) {
              const position = { x, y, z };
              
              // Если ящик можно разместить без пересечений
              if (!hasIntersections(position, orientation, placedPallets, placedBoxes)) {
                placedBoxes.push({
                  dimensions: orientation,
                  position,
                  weight: 5
                });
                break;
              }
            }
          }
        }
      }
    }
  });

  return placedBoxes;
} 