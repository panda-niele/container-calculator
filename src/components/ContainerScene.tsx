import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Html } from '@react-three/drei';
import { Container, Pallet, Box } from '../types/types';
import * as THREE from 'three';

/**
 * Основные props для сцены контейнера
 * container - размеры и параметры контейнера
 * pallets - массив паллет для отображения
 * boxes - массив ящиков для отображения
 */
interface ContainerSceneProps {
  container: Container;
  pallets: Pallet[];
  boxes: Box[];
}

/**
 * Компонент для отображения подписей осей координат (X, Y, Z)
 * Создает HTML элемент, который всегда повернут к камере
 * position - позиция подписи в 3D пространстве
 * text - текст подписи (X, Y или Z)
 */
const AxisLabel: React.FC<{ position: [number, number, number]; text: string }> = ({ position, text }) => (
  <Html position={position} center>
    <div style={{ 
      color: 'black',
      backgroundColor: 'white',
      padding: '2px 5px',
      borderRadius: '3px',
      fontWeight: 'bold',
      opacity: 0.8,
      fontSize: '12px'
    }}>
      {text}
    </div>
  </Html>
);

/**
 * Основной компонент 3D сцены
 * Отвечает за отображение контейнера, паллет и ящиков в трехмерном пространстве
 */
const ContainerScene: React.FC<ContainerSceneProps> = ({ container, pallets, boxes }) => {
  // Вычисляем позицию камеры на основе размеров контейнера
  // Камера располагается так, чтобы весь контейнер был виден
  const cameraPosition = useMemo(() => {
    const maxDimension = Math.max(container.dimensions.width, container.dimensions.height, container.dimensions.depth);
    return [maxDimension * 2, maxDimension * 1.5, maxDimension * 2] as [number, number, number];
  }, [container.dimensions]);

  // Создаем подписи для осей координат
  // Располагаем их на небольшом расстоянии от концов осей
  const axisLabels = useMemo(() => {
    const offset = 0.5;
    return [
      { position: [container.dimensions.width + offset, 0, 0] as [number, number, number], text: 'X' },
      { position: [0, container.dimensions.height + offset, 0] as [number, number, number], text: 'Y' },
      { position: [0, 0, container.dimensions.depth + offset] as [number, number, number], text: 'Z' }
    ];
  }, [container.dimensions]);

  return (
    <Canvas shadows>
      {/* Настройка камеры и элементов управления сценой */}
      <PerspectiveCamera makeDefault position={cameraPosition} />
      <OrbitControls 
        minDistance={2} 
        maxDistance={50}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
      />
      
      {/* Настройка освещения сцены */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 10, 10]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      
      {/* Сетка для лучшего восприятия пространства */}
      <gridHelper args={[30, 30, '#888888', '#444444']} />
      
      {/* Отрисовка основных элементов сцены */}
      <ContainerMesh container={container} />
      {pallets.map((pallet, index) => (
        <PalletMesh key={`pallet-${index}`} pallet={pallet} container={container} index={index} />
      ))}
      {boxes.map((box, index) => (
        <BoxMesh key={`box-${index}`} box={box} container={container} index={index} />
      ))}
      {axisLabels.map((label, index) => (
        <AxisLabel key={index} position={label.position} text={label.text} />
      ))}
    </Canvas>
  );
};

/**
 * Компонент для отображения контейнера
 * Создает полупрозрачный контейнер с каркасом и осями координат
 */
const ContainerMesh: React.FC<{ container: Container }> = ({ container }) => {
  // Материалы для отрисовки контейнера
  const wireframeMaterial = useMemo(() => new THREE.LineBasicMaterial({ color: '#000000' }), []);
  const containerMaterial = useMemo(() => 
    new THREE.MeshStandardMaterial({ 
      color: '#808080', 
      opacity: 0.1,
      transparent: true,
      side: THREE.DoubleSide 
    }), []);

  // Центр контейнера для правильного позиционирования
  const position: [number, number, number] = [
    container.dimensions.width / 2,
    container.dimensions.height / 2,
    container.dimensions.depth / 2
  ];

  // Создаем геометрию для осей координат
  // Каждая ось имеет свой цвет: X - красный, Y - зеленый, Z - синий
  const xAxisGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      0, 0, 0,
      container.dimensions.width + 0.5, 0, 0
    ]);
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    return geometry;
  }, [container.dimensions.width]);

  const yAxisGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      0, 0, 0,
      0, container.dimensions.height + 0.5, 0
    ]);
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    return geometry;
  }, [container.dimensions.height]);

  const zAxisGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      0, 0, 0,
      0, 0, container.dimensions.depth + 0.5
    ]);
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    return geometry;
  }, [container.dimensions.depth]);

  return (
    <group>
      {/* Полупрозрачный контейнер */}
      <mesh position={position}>
        <boxGeometry args={[container.dimensions.width, container.dimensions.height, container.dimensions.depth]} />
        <primitive object={containerMaterial} attach="material" />
      </mesh>
      
      {/* Каркас контейнера */}
      <lineSegments position={position}>
        <edgesGeometry args={[new THREE.BoxGeometry(container.dimensions.width, container.dimensions.height, container.dimensions.depth)]} />
        <primitive object={wireframeMaterial} attach="material" />
      </lineSegments>
      
      {/* Оси координат */}
      <lineSegments geometry={xAxisGeometry}>
        <lineBasicMaterial attach="material" color="red" />
      </lineSegments>
      <lineSegments geometry={yAxisGeometry}>
        <lineBasicMaterial attach="material" color="green" />
      </lineSegments>
      <lineSegments geometry={zAxisGeometry}>
        <lineBasicMaterial attach="material" color="blue" />
      </lineSegments>
    </group>
  );
};

/**
 * Компонент для отображения паллеты
 * Создает каркасное представление паллеты в виде прозрачного куба с черными гранями
 */
const PalletMesh: React.FC<{ pallet: Pallet; container: Container; index: number }> = ({ pallet, container, index }) => {
  // Вычисляем центр паллеты для правильного позиционирования
  const position: [number, number, number] = [
    pallet.position.x + pallet.dimensions.width / 2,
    pallet.position.y + pallet.dimensions.height / 2,
    pallet.position.z + pallet.dimensions.depth / 2
  ];

  // Материалы для отрисовки паллеты
  const palletMaterial = useMemo(() => 
    new THREE.MeshStandardMaterial({ 
      opacity: 0,
      transparent: true,
      side: THREE.DoubleSide
    }), []);

  const wireframeMaterial = useMemo(() => new THREE.LineBasicMaterial({ color: '#000000' }), []);

  return (
    <group>
      {/* Прозрачная паллета */}
      <mesh position={position}>
        <boxGeometry args={[pallet.dimensions.width, pallet.dimensions.height, pallet.dimensions.depth]} />
        <primitive object={palletMaterial} attach="material" />
      </mesh>
      
      {/* Каркас паллеты */}
      <lineSegments position={position}>
        <edgesGeometry args={[new THREE.BoxGeometry(pallet.dimensions.width, pallet.dimensions.height, pallet.dimensions.depth)]} />
        <primitive object={wireframeMaterial} attach="material" />
      </lineSegments>
    </group>
  );
};

/**
 * Компонент для отображения ящика
 * Создает каркасное представление ящика аналогично паллете
 */
const BoxMesh: React.FC<{ box: Box; container: Container; index: number }> = ({ box, container, index }) => {
  // Вычисляем центр ящика для правильного позиционирования
  const position: [number, number, number] = [
    box.position.x + box.dimensions.width / 2,
    box.position.y + box.dimensions.height / 2,
    box.position.z + box.dimensions.depth / 2
  ];

  // Материалы для отрисовки ящика
  const boxMaterial = useMemo(() => 
    new THREE.MeshStandardMaterial({ 
      opacity: 0,
      transparent: true,
      side: THREE.DoubleSide
    }), []);

  const wireframeMaterial = useMemo(() => new THREE.LineBasicMaterial({ color: '#000000' }), []);

  return (
    <group>
      {/* Прозрачный ящик */}
      <mesh position={position}>
        <boxGeometry args={[box.dimensions.width, box.dimensions.height, box.dimensions.depth]} />
        <primitive object={boxMaterial} attach="material" />
      </mesh>
      
      {/* Каркас ящика */}
      <lineSegments position={position}>
        <edgesGeometry args={[new THREE.BoxGeometry(box.dimensions.width, box.dimensions.height, box.dimensions.depth)]} />
        <primitive object={wireframeMaterial} attach="material" />
      </lineSegments>
    </group>
  );
};

export default ContainerScene; 