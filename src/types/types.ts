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

export interface Container {
  dimensions: Dimensions;
  maxWeight: number;
}

export interface Pallet {
  dimensions: Dimensions;
  weight: number;
  position: Position;
}

export interface Box {
  dimensions: Dimensions;
  weight: number;
  position: Position;
}

export interface PackingResult {
  pallets: Pallet[];
  boxes?: Box[];
  unusedSpace: number;
  totalWeight: number;
  utilizationPercentage: number;
} 