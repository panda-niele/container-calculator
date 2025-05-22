export interface Dimensions {
  width: number;
  height: number;
  depth: number;
}

export interface Position {
  x: number;
  y: number;
  z: number;
}

export interface PackedItem {
  position: Position;
  dimensions: Dimensions;
  type: 'box' | 'pallet';
}

// Dimensioni standard dei pallet in centimetri | Стандартные размеры паллет в сантиметрах
export const STANDARD_PALLET: Dimensions = { width: 80, height: 14, depth: 120 };

/**
 * Simple algorithm to pack boxes on pallets within a container
 * inizio algoritmo per mettere la roba sui pallet nel container
 * алгоритм укладки вещей на поддоны в контейнере
 */
export function packBoxes(
  container: Dimensions,
  box: Dimensions,
  quantity: number,
  usePallets: boolean = true
): PackedItem[] {
  const packedItems: PackedItem[] = [];
  
 // Se non si usano pallet, impacchettare scatole direttamente | Если не используются поддоны, упаковывать коробки напрямую
  if (!usePallets) {
    return packBoxesDirectly(container, box, quantity);
  }
  
  // Calcola quante scatole entrano su un singolo pallet | Рассчитай сколько коробок поместится на один поддон
  const boxesPerPalletX = Math.floor(STANDARD_PALLET.width / box.width);
  const boxesPerPalletZ = Math.floor(STANDARD_PALLET.depth / box.depth);
  const boxesPerPallet = boxesPerPalletX * boxesPerPalletZ;
  
  // Calcola quanti pallet sono necessari | Рассчитай необходимое количество поддонов
  const palletsNeeded = Math.ceil(quantity / boxesPerPallet);
  
  // Calcola quanti pallet entrano nel container | Рассчитай сколько поддонов поместится в контейнер
  const palletsPerContainerX = Math.floor(container.width / STANDARD_PALLET.width);
  const palletsPerContainerY = Math.floor(container.height / STANDARD_PALLET.height);
  const palletsPerContainerZ = Math.floor(container.depth / STANDARD_PALLET.depth);
  const maxPallets = palletsPerContainerX * palletsPerContainerY * palletsPerContainerZ;
  
  // Limita i pallet a ciò che può effettivamente entrare | Ограничь поддо по фактической вместимости
  const palletsToPack = Math.min(palletsNeeded, maxPallets);
  let boxesRemaining = quantity;
  
  // Posiziona i pallet nel container | Размести поддоны в контейнере
  let palletCount = 0;
  for (let py = 0; py < palletsPerContainerY && palletCount < palletsToPack; py++) {
    for (let pz = 0; pz < palletsPerContainerZ && palletCount < palletsToPack; pz++) {
      for (let px = 0; px < palletsPerContainerX && palletCount < palletsToPack; px++) {
        const palletPosition: Position = {
          x: px * STANDARD_PALLET.width,
          y: py * (STANDARD_PALLET.height + box.height * Math.ceil(boxesPerPallet / (boxesPerPalletX * boxesPerPalletZ))),
          z: pz * STANDARD_PALLET.depth
        };
        
        // Aggiungi pallet agli elementi impacchettati | Добавь поддон к упакованным элементам
        packedItems.push({
          position: palletPosition,
          dimensions: STANDARD_PALLET,
          type: 'pallet'
        });
        
        // Imballa scatole su questo pallet | Упакуй коробки на этот поддон
        const boxesForThisPallet = Math.min(boxesPerPallet, boxesRemaining);
        let boxesPlaced = 0;
        
        for (let bz = 0; bz < boxesPerPalletZ && boxesPlaced < boxesForThisPallet; bz++) {
          for (let bx = 0; bx < boxesPerPalletX && boxesPlaced < boxesForThisPallet; bx++) {
            const boxPosition: Position = {
              x: palletPosition.x + bx * box.width,
              y: palletPosition.y + STANDARD_PALLET.height, // Place box on top of pallet
              z: palletPosition.z + bz * box.depth
            };
            
            packedItems.push({
              position: boxPosition,
              dimensions: box,
              type: 'box'
            });
            
            boxesPlaced++;
            boxesRemaining--;
          }
        }
        
        palletCount++;
      }
    }
  }
  
  return packedItems;
}

/**
 * Funzione per imballare scatole direttamente in un container senza pallet
 * Функция для упаковки коробок напрямую в контейнер без поддонов
 */
function packBoxesDirectly(
  container: Dimensions,
  box: Dimensions,
  quantity: number
): PackedItem[] {
  const packedItems: PackedItem[] = [];

  // Calcola quante scatole entrano in ogni direzione | Рассчитай сколько коробок помещается по каждому направлению
  const maxBoxesX = Math.floor(container.width / box.width);
  const maxBoxesY = Math.floor(container.height / box.height);
  const maxBoxesZ = Math.floor(container.depth / box.depth);
  
  // Numero massimo di scatole che entrano nel container | Максимальное количество коробок, помещающихся в контейнер
  const maxBoxes = maxBoxesX * maxBoxesY * maxBoxesZ;
  
  // Limita la quantità a ciò che può effettivamente entrare | Ограничь количество по фактической вместимости
  const boxesToPack = Math.min(quantity, maxBoxes);

  // Scorri ogni posizione nel container | Перебирай каждую позицию в контейнере
  for (let z = 0; z < maxBoxesZ && packedItems.length < boxesToPack; z++) {
    for (let y = 0; y < maxBoxesY && packedItems.length < boxesToPack; y++) {
      for (let x = 0; x < maxBoxesX && packedItems.length < boxesToPack; x++) {
        const position: Position = {
          x: x * box.width,
          y: y * box.height,
          z: z * box.depth
        };
        
        packedItems.push({
          position,
          dimensions: box,
          type: 'box'
        });
      }
    }
  }

  return packedItems;
}

/**
 * Calcola il volume di una scatola
 * Вычисляет объем коробки
 */
export function calculateVolume(dimensions: Dimensions): number {
  return dimensions.width * dimensions.height * dimensions.depth;
}

/**
 * Calcola il volume totale di tutte le scatole
 * Вычисляет общий объем всех коробок
 */
export function calculateTotalVolume(box: Dimensions, quantity: number): number {
  return calculateVolume(box) * quantity;
}

/**
 * Calcola la percentuale del volume del contenitore che è riempita 
 * Рассчитывает процент объема контейнера, который заполнен
 */
export function calculateFillPercentage(
  container: Dimensions,
  box: Dimensions,
  quantity: number,
  usePallets: boolean = true
): number {
  const containerVolume = calculateVolume(container);
  let totalVolume = calculateTotalVolume(box, quantity);
  
  if (usePallets) {
    // Calcola quante scatole possono stare su un singolo pallet 
    // Рассчитывает, сколько коробок может поместиться на один паллет
    const boxesPerPalletX = Math.floor(STANDARD_PALLET.width / box.width);
    const boxesPerPalletZ = Math.floor(STANDARD_PALLET.depth / box.depth);
    const boxesPerPallet = boxesPerPalletX * boxesPerPalletZ;
    
    // Рассчитывает, сколько поддонов нам нужно 
    // Calcola quanti pallet ci servono
    const palletsNeeded = Math.ceil(quantity / boxesPerPallet);
    
    // Добавляет объем поддонов 
    // Aggiungi il volume dei pallet
    totalVolume += calculateVolume(STANDARD_PALLET) * palletsNeeded;
  }
  
  return Math.min(100, (totalVolume / containerVolume) * 100);
}

/**
 * Рассчитывает максимальное количество коробок, которые могут поместиться в контейнер 
 * Calcola il numero massimo di scatole che possono stare nel contenitore
 */
export function calculateMaxBoxes(
  container: Dimensions, 
  box: Dimensions,
  usePallets: boolean = true
): number {
  if (!usePallets) {
    const maxBoxesX = Math.floor(container.width / box.width);
    const maxBoxesY = Math.floor(container.height / box.height);
    const maxBoxesZ = Math.floor(container.depth / box.depth);
    
    return maxBoxesX * maxBoxesY * maxBoxesZ;
  } else {
    // Рассчитывает, сколько коробок может поместиться на один поддон 
    // Calcola quante scatole possono stare su un singolo pallet
    const boxesPerPalletX = Math.floor(STANDARD_PALLET.width / box.width);
    const boxesPerPalletZ = Math.floor(STANDARD_PALLET.depth / box.depth);
    const boxesPerPallet = boxesPerPalletX * boxesPerPalletZ;
    
    // Рассчитывает, сколько поддонов может поместиться в контейнер 
    // Calcola quanti pallet possono stare nel contenitore
    const palletsPerContainerX = Math.floor(container.width / STANDARD_PALLET.width);
    const palletsPerContainerY = Math.floor(container.height / STANDARD_PALLET.height);
    const palletsPerContainerZ = Math.floor(container.depth / STANDARD_PALLET.depth);
    const maxPallets = palletsPerContainerX * palletsPerContainerY * palletsPerContainerZ;
    
    return maxPallets * boxesPerPallet;
  }
}
