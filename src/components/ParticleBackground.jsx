import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ParticleField = () => {
    const count = 1500;
    const mesh = useRef();

    const [positions, sizes] = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const s = new Float32Array(count);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 10;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
            s[i] = Math.random() * 2;
        }
        return [pos, s];
    }, []);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        mesh.current.rotation.y = t * 0.05;
        mesh.current.rotation.x = t * 0.02;
    });

    return (
        <points ref={mesh}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={positions.length / 3}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.015}
                color="#3b82f6"
                transparent
                opacity={0.4}
                sizeAttenuation={true}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
};

const ParticleBackground = () => {
    return (
        <div className="fixed inset-0 z-[-1] pointer-events-none bg-slate-950">
            <Canvas camera={{ position: [0, 0, 5], fov: 75 }} dpr={[1, 2]}>
                <ParticleField />
            </Canvas>
        </div>
    );
};

export default ParticleBackground;
