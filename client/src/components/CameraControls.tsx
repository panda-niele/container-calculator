import { useEffect, useRef, useState } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useAudio } from "@/lib/stores/useAudio";
import { Vector3 } from "three";

type CameraView = 'default' | 'top' | 'front' | 'side' | 'corner';

type CameraPosition = {
  position: [number, number, number];
  target: [number, number, number];
};

type MoveToPosition = {
  position: Vector3;
  target: Vector3;
  progress: number;
};

const CAMERA_POSITIONS: Record<CameraView, CameraPosition> = {
  default: { position: [1500, 1500, 2500], target: [300, 120, 600] },
  top: { position: [600, 2000, 600], target: [600, 0, 600] },
  front: { position: [600, 120, 2500], target: [450, 120, 0] },
  side: { position: [2500, 120, 600], target: [0, 120, 600] },
  corner: { position: [1800, 1800, 1800], target: [300, 120, 600] },
};

export default function CameraControls() {
  const controlsRef = useRef<any>(null);
  const { camera, gl } = useThree();
  const { playHit } = useAudio();
  const [currentView, setCurrentView] = useState<CameraView>('default');
  const [moveToPosition, setMoveToPosition] = useState<MoveToPosition | null>(null);
  
  // Gestisci le modifiche alla posizione della fotocamera
// Обработка изменений позиции камеры
  useEffect(() => {
    if (!controlsRef.current) return;
    
    const currentPosition = CAMERA_POSITIONS[currentView];
    if (currentPosition) {
     // Inizia la transizione della fotocamera
// Начать переход камеры
      setMoveToPosition({
        position: new Vector3(...currentPosition.position),
        target: new Vector3(...currentPosition.target),
        progress: 0
      });
      
      // Play sound effect
      playHit();
    }
  }, [currentView, playHit]);
  
  // Anima le modifiche alla posizione della fotocamera
// Анимировать изменения позиции камеры
  useFrame(() => {
    if (moveToPosition && moveToPosition.progress < 1 && controlsRef.current) {
      moveToPosition.progress += 0.02; // Speed of transition
      
      if (moveToPosition.progress >= 1) {
        // Transizione completata
// Переход завершен
        camera.position.copy(moveToPosition.position);
        controlsRef.current.target.copy(moveToPosition.target);
        setMoveToPosition(null);
      } else {
        // Smoothly interpolate position
        const t = moveToPosition.progress;
        const smoothT = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // Smooth easing
        
        camera.position.lerp(moveToPosition.position, smoothT);
        controlsRef.current.target.lerp(moveToPosition.target, smoothT);
      }
      
      controlsRef.current.update();
    }
  });
  
  // Set up camera controls
  useEffect(() => {
    if (controlsRef.current) {
      // Add key controls for different views
      const handleKeyDown = (e: KeyboardEvent) => {
        switch (e.key) {
          case '1':
            setCurrentView('default');
            break;
          case '2':
            setCurrentView('top');
            break;
          case '3':
            setCurrentView('front');
            break;
          case '4':
            setCurrentView('side');
            break;
          case '5':
            setCurrentView('corner');
            break;
        }
      };
      
      // Play sound when camera controls start or end
      const handleStart = () => {
        playHit();
      };
      
      // event listeners
      window.addEventListener('keydown', handleKeyDown);
      controlsRef.current.addEventListener("start", handleStart);
      
      // Clean up
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        if (controlsRef.current) {
          controlsRef.current.removeEventListener("start", handleStart);
        }
      };
    }
  }, [playHit]);

  return (
    <>
      <OrbitControls
        ref={controlsRef}
        args={[camera, gl.domElement]}
        enableDamping={true}
        dampingFactor={0.05}
        minDistance={50}
        maxDistance={8000}
        rotateSpeed={0.5}
        zoomSpeed={0.7}
        target={new Vector3(...CAMERA_POSITIONS.default.target)}
      />
      
      {/* Info text displayed in the scene - press keys 1-5 to change views */}
      <PerspectiveCamera 
        position={[0, 0, 0]} 
        makeDefault={false}
      >
        <mesh position={[0, 0, -5]} scale={[0.1, 0.1, 0.1]}>
          <planeGeometry args={[10, 1]} />
          <meshBasicMaterial color="black" transparent opacity={0} />
        </mesh>
      </PerspectiveCamera>
    </>
  );
}
