import { useEffect, useState } from "react";
import { Grid, Environment } from "@react-three/drei";
import Package3D from "./Package3D";
import Pallet3D from "./Pallet3D";
import Container3D from "./Container3D";
import CameraControls from "./CameraControls";
import type { Dimensions } from "@/lib/packing-algorithm";
import { 
  packBoxes, 
  calculateFillPercentage, 
  type PackedItem,
  STANDARD_PALLET
} from "@/lib/packing-algorithm";

interface ContainerVisualizerProps {
  containerDimensions: Dimensions;
  packageDimensions: Dimensions;
  packageQuantity: number;
  usePallets?: boolean;
}

export default function ContainerVisualizer({
  containerDimensions,
  packageDimensions,
  packageQuantity,
  usePallets = true
}: ContainerVisualizerProps) {
  const [packedItems, setPackedItems] = useState<PackedItem[]>([]);
  const [fillPercentage, setFillPercentage] = useState(0);

  // Impacchetta le scatole quando le dimensioni o la quantità cambiano
// Упаковывать коробки при изменении размеров или количества
  useEffect(() => {
    // Imballa le scatole usando l'algoritmo  
// Упаковывает коробки с помощью алгоритма  
    const items = packBoxes(containerDimensions, packageDimensions, packageQuantity, usePallets);
    setPackedItems(items);
    
    // Calcola la percentuale di riempimento  
// Вычисляет процент заполнения  
    const percentage = calculateFillPercentage(
      containerDimensions,
      packageDimensions,
      packageQuantity,
      usePallets
    );
    setFillPercentage(percentage);
  }, [containerDimensions, packageDimensions, packageQuantity, usePallets]);

  return (
    <>
      {/* Illuminazione | Освещение */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[500, 500, 500]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      
      {/* Ambiente | Окружение */}
      <Environment preset="warehouse" />
      
      {/* Griglia | Сетка */}
      <Grid
        infiniteGrid
        cellSize={40}
        cellThickness={0.6}
        cellColor="#6f6f6f"
        sectionSize={200}
        sectionThickness={1.5}
        sectionColor="#9d4b4b"
        fadeDistance={1000}
        fadeStrength={1}
      />
      
      {/* Contenitore | Контейнер */}
      <Container3D 
        dimensions={containerDimensions} 
        fillPercentage={fillPercentage} 
      />
      
      {/* Oggetti (Pacchi e Bancali) | Объекты (Упаковки и Паллеты) */}
      {packedItems.map((item, index) => 
        item.type === 'box' ? (
          <Package3D
            key={`box-${index}`}
            position={item.position}
            dimensions={packageDimensions}
            index={index}
          />
        ) : (
          <Pallet3D
            key={`pallet-${index}`}
            position={item.position}
            dimensions={STANDARD_PALLET}
          />
        )
      )}
      
      {/* Camera Controls */}
      <CameraControls />
    </>
  );
}
