import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Sphere, Torus, MeshDistortMaterial, MeshWobbleMaterial } from '@react-three/drei';
import * as THREE from 'three';

const TechCore = () => {
    const coreRef = useRef();
    const ring1Ref = useRef();
    const ring2Ref = useRef();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        coreRef.current.rotation.y = t * 0.4;
        coreRef.current.rotation.z = t * 0.2;

        ring1Ref.current.rotation.x = t * 0.6;
        ring1Ref.current.rotation.y = t * 0.3;

        ring2Ref.current.rotation.z = t * 0.5;
        ring2Ref.current.rotation.x = t * 0.2;
    });

    return (
        <group>
            {/* Central Core */}
            <Sphere ref={coreRef} args={[1, 64, 64]}>
                <MeshDistortMaterial
                    color="#3b82f6"
                    speed={3}
                    distort={0.4}
                    radius={1}
                    metalness={0.9}
                    roughness={0.1}
                    emissive="#1d4ed8"
                    emissiveIntensity={2}
                />
            </Sphere>

            {/* Orbiting Rings */}
            <Torus ref={ring1Ref} args={[1.8, 0.03, 16, 100]} rotation={[Math.PI / 4, 0, 0]}>
                <meshStandardMaterial color="#60a5fa" emissive="#60a5fa" emissiveIntensity={4} transparent opacity={0.6} />
            </Torus>

            <Torus ref={ring2Ref} args={[2.2, 0.02, 16, 100]} rotation={[0, Math.PI / 3, 0]}>
                <meshStandardMaterial color="#93c5fd" emissive="#93c5fd" emissiveIntensity={3} transparent opacity={0.4} />
            </Torus>

            {/* Point Light inside core */}
            <pointLight intensity={15} color="#3b82f6" distance={5} />
        </group>
    );
};

const Model3D = () => {
    return (
        <div className="w-full h-[500px] cursor-grab active:cursor-grabbing">
            <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 2]}>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="#ffffff" />
                <pointLight position={[-10, -10, -10]} intensity={1} color="#3b82f6" />

                <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                    <TechCore />
                </Float>

                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
            </Canvas>
        </div>
    );
};

export default Model3D;
