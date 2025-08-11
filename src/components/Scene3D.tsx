import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Sphere } from '@react-three/drei';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      (canvas as any).getContext('experimental-webgl')
    );
  } catch {
    return false;
  }
}

function AnimatedSphere({ position, color }: { position: [number, number, number], color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={meshRef} position={position} args={[0.5, 32, 32]}>
        <meshStandardMaterial color={color} transparent opacity={0.6} />
      </Sphere>
    </Float>
  );
}

export const Scene3D = () => {
  if (typeof window === 'undefined' || !isWebGLAvailable()) return null;

  return (
    <div className="fixed inset-0 pointer-events-none opacity-30 z-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        onCreated={(state) => {
          try {
            const canvas = state.gl.getContext()?.canvas as HTMLCanvasElement | undefined;
            canvas?.addEventListener('webglcontextlost', (e) => {
              e.preventDefault();
            });
          } catch (e) {
            // eslint-disable-next-line no-console
            console.warn('WebGL context handling not available', e);
          }
        }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        
        <AnimatedSphere position={[-3, 2, -2]} color="#22c55e" />
        <AnimatedSphere position={[3, -2, -3]} color="#f97316" />
        <AnimatedSphere position={[0, 3, -4]} color="#3b82f6" />
        <AnimatedSphere position={[-2, -3, -2]} color="#8b5cf6" />
        <AnimatedSphere position={[4, 1, -5]} color="#ec4899" />
        
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
};