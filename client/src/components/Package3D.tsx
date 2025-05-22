import { useRef } from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import type { Dimensions, Position } from "@/lib/packing-algorithm";

interface Package3DProps {
  position: Position;
  dimensions: Dimensions;
  index: number;
}

export default function Package3D({ position, dimensions, index }: Package3DProps) {
  const { width, height, depth } = dimensions;
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Load texture for packages
  const texture = useTexture("/textures/wood.jpg");
  
  // Crea colori diversi per i pacchi per una migliore visualizzazione | Создает разные цвета упаковок для лучшей визуализации
  const getPackageColor = (index: number): string => {
    const colors = [
      "#8BC34A", // Light Green
      "#4CAF50", // Green
      "#009688", // Teal
      "#00BCD4", // Cyan
      "#03A9F4", // Light Blue
      "#2196F3", // Blue
    ];
    return colors[index % colors.length];
  };

  return (
    <mesh
      ref={meshRef}
      position={[
        position.x + width / 2,
        position.y + height / 2,
        position.z + depth / 2,
      ]}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[width, height, depth]} />
      <meshStandardMaterial
        map={texture}
        color={getPackageColor(index)}
        metalness={0.1}
        roughness={0.5}
      />
    </mesh>
  );
}
