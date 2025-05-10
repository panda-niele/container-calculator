import { Container, Pallet, PackingResult, Position, Box, Dimensions } from '../types/types';
import { placePallets, checkIntersection as checkSpaceIntersection } from './palletPacking';
import { placeBoxes } from './boxPacking';


/**
 * Основная функция оптимизации размещения
 * Размещает паллеты и ящики в контейнере, максимизируя использование пространства
 * @param container - Контейнер для размещения
 * @param pallets - Массив паллет для размещения
 * @param boxDimensions - Размеры ящиков
 * @returns Результат размещения с метриками
 */
export function optimizeContainerPacking(
  container: Container,
  pallets: Pallet[],
  boxDimensions: { width: number; height: number; depth: number }
): PackingResult {
  if (!pallets.length) {
    throw new Error('No pallets provided');
  }
  
  // Размещаем паллеты
  const placedPallets = placePallets(container, pallets[0].dimensions);
  
  // Размещаем ящики в оставшемся пространстве
  const placedBoxes = placeBoxes(container, boxDimensions, placedPallets);
  
  // Вычисляем метрики использования пространства
  const totalVolume = container.dimensions.width * container.dimensions.height * container.dimensions.depth;
  const usedVolumeByPallets = placedPallets.reduce((acc, item) => 
    acc + (item.dimensions.width * item.dimensions.height * item.dimensions.depth), 0
  );
  const usedVolumeByBoxes = placedBoxes.reduce((acc, item) =>
    acc + (item.dimensions.width * item.dimensions.height * item.dimensions.depth), 0
  );
  const totalUsedVolume = usedVolumeByPallets + usedVolumeByBoxes;
  
  // Возвращаем результат с размещенными объектами и метриками
  return {
    pallets: placedPallets,
    boxes: placedBoxes,
    unusedSpace: totalVolume - totalUsedVolume,
    totalWeight: placedPallets.reduce((acc, item) => acc + item.weight, 0) +
                placedBoxes.reduce((acc, item) => acc + item.weight, 0),
    utilizationPercentage: (totalUsedVolume / totalVolume) * 100
  };
}
