import { useRef } from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import type { Dimensions, Position } from "@/lib/packing-algorithm";

interface Pallet3DProps {
  position: Position;
  dimensions: Dimensions;
}

export default function Pallet3D({ position, dimensions }: Pallet3DProps) {
  const { width, height, depth } = dimensions;
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Load texture for pallets - wood texture works well for pallets
  const texture = useTexture("/textures/wood.jpg");
  
  // Create a pallet with slats for more realistic appearance
  return (
    <group
      position={[
        position.x + width / 2,
        position.y + height / 2,
        position.z + depth / 2,
      ]}
      castShadow
      receiveShadow
    >
      {/* Base layer - bottom deck boards */}
      <mesh ref={meshRef} position={[0, -height * 0.3, 0]}>
        <boxGeometry args={[width, height * 0.2, depth]} />
        <meshStandardMaterial
          map={texture}
          color="#8B4513" // Dark brown for pallets
          metalness={0.1}
          roughness={0.8}
        />
      </mesh>
      
      {/* Middle layer - stringers/blocks */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[width * 0.9, height * 0.6, depth * 0.1]} />
        <meshStandardMaterial
          map={texture}
          color="#A0522D" // Medium brown
          metalness={0.1}
          roughness={0.8}
        />
      </mesh>
      
      <mesh position={[0, 0, depth * 0.45]}>
        <boxGeometry args={[width * 0.9, height * 0.6, depth * 0.1]} />
        <meshStandardMaterial
          map={texture}
          color="#A0522D" // Medium brown
          metalness={0.1}
          roughness={0.8}
        />
      </mesh>
      
      <mesh position={[0, 0, -depth * 0.45]}>
        <boxGeometry args={[width * 0.9, height * 0.6, depth * 0.1]} />
        <meshStandardMaterial
          map={texture}
          color="#A0522D" // Medium brown
          metalness={0.1}
          roughness={0.8}
        />
      </mesh>
      
      {/* Top layer - top deck boards */}
      <mesh position={[0, height * 0.3, 0]}>
        <boxGeometry args={[width, height * 0.2, depth]} />
        <meshStandardMaterial
          map={texture}
          color="#8B4513" // Dark brown
          metalness={0.1}
          roughness={0.8}
        />
      </mesh>
    </group>
  );
}