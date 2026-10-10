import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface HologramShield3DProps {
  size?: number;
  className?: string;
}

export const HologramShield3D: React.FC<HologramShield3DProps> = ({
  size = 120,
  className = ''
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
    camera.position.z = 85;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // 1. Core Glowing Polyhedron (Icosahedron)
    const icosaGeom = new THREE.IcosahedronGeometry(22, 1);
    const icosaWire = new THREE.WireframeGeometry(icosaGeom);
    const wireMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.8
    });
    const icosaLine = new THREE.LineSegments(icosaWire, wireMat);
    group.add(icosaLine);

    // 2. Inner Crystal Solid
    const innerGeom = new THREE.IcosahedronGeometry(15, 0);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      wireframe: true,
      transparent: true,
      opacity: 0.4
    });
    const innerMesh = new THREE.Mesh(innerGeom, innerMat);
    group.add(innerMesh);

    // 3. Orbiting Gyroscope Rings
    const ring1Geom = new THREE.RingGeometry(30, 31.5, 48);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.6
    });
    const ring1 = new THREE.Mesh(ring1Geom, ring1Mat);
    group.add(ring1);

    const ring2Geom = new THREE.RingGeometry(34, 35.2, 48);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0x818cf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5
    });
    const ring2 = new THREE.Mesh(ring2Geom, ring2Mat);
    ring2.rotation.x = Math.PI / 3;
    group.add(ring2);

    // 4. Sparkling Constellation Particles
    const particleCount = 60;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const radius = 25 + Math.random() * 15;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      particlePositions[i * 3] = radius * Math.cos(phi) * Math.sin(theta);
      particlePositions[i * 3 + 1] = radius * Math.sin(phi);
      particlePositions[i * 3 + 2] = radius * Math.cos(phi) * Math.cos(theta);
    }
    const particleGeom = new THREE.BufferGeometry();
    particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 1.5,
      transparent: true,
      opacity: 0.75
    });
    const particles = new THREE.Points(particleGeom, particleMat);
    group.add(particles);

    // 5. Mouse Reactive Tilt
    let mouse = { x: 0, y: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouse.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // 6. Animation loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Gyroscope rotation
      icosaLine.rotation.y = elapsed * 0.4;
      icosaLine.rotation.x = elapsed * 0.2;

      innerMesh.rotation.y = -elapsed * 0.6;
      innerMesh.rotation.z = elapsed * 0.3;

      ring1.rotation.z = elapsed * 0.5;
      ring1.rotation.x = Math.sin(elapsed * 0.8) * 0.5;

      ring2.rotation.y = -elapsed * 0.4;
      ring2.rotation.z = Math.cos(elapsed * 0.7) * 0.4;

      particles.rotation.y = elapsed * 0.15;

      // Cursor follow
      group.rotation.y += (mouse.x * 0.8 - group.rotation.y) * 0.05;
      group.rotation.x += (-mouse.y * 0.8 - group.rotation.x) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      renderer.dispose();
    };
  }, [size]);

  return (
    <div
      ref={mountRef}
      style={{ width: size, height: size }}
      className={`inline-block ${className}`}
    />
  );
};
