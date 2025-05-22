import { useRef } from "react";
import * as THREE from "three";
import type { Dimensions } from "@/lib/packing-algorithm";

interface Container3DProps {
  dimensions: Dimensions;
  fillPercentage: number;
}

export default function Container3D({ dimensions, fillPercentage }: Container3DProps) {
  const { width, height, depth } = dimensions;
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Usa il colore rosso per il contenitore
// Использовать красный цвет для контейнера
  const containerColor = new THREE.Color(0.8, 0.2, 0.2); 

  return (
    <mesh
      ref={meshRef}
      position={[width / 2, height / 2, depth / 2]}
      scale={[1, 1, 1]}
    >
      <boxGeometry args={[width, height, depth]} />
      <meshStandardMaterial
        color={containerColor}
        transparent={true}
        opacity={0.6}
        side={THREE.DoubleSide}
        wireframe={true}
        emissive={new THREE.Color(0.4, 0.1, 0.1)}
        emissiveIntensity={0.3}
      />
    </mesh>
  );
}
