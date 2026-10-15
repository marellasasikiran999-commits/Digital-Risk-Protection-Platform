import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * LiquidGlassBackground3D
 * Hardware-accelerated 3D WebGL background layer.
 * Contains a morphing digital mesh sphere and a fluid 3D particle array in cyan and steel-blue tones.
 * Strictly positioned at `absolute inset-0 w-full h-full z-0 pointer-events-none`.
 */
export const LiquidGlassBackground3D = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let animationFrameId;
    let renderer;

    try {
      // Scene, Camera, and Hardware-Accelerated WebGL Renderer
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        55,
        container.clientWidth / Math.max(container.clientHeight, 1),
        0.1,
        1000
      );
      camera.position.z = 24;

      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setClearColor(0x000000, 0);

      container.appendChild(renderer.domElement);

      // Root Transform Group
      const sceneGroup = new THREE.Group();
      scene.add(sceneGroup);

      // 1. Digital Mesh Sphere (Icosahedron Wireframe with Pulsing Morph Nodes)
      const sphereGeometry = new THREE.IcosahedronGeometry(7.5, 3);
      // Save original vertex positions for fluid sine-wave morphing
      const positionAttr = sphereGeometry.attributes.position;
      const originalPositions = new Float32Array(positionAttr.array);

      const sphereMaterial = new THREE.MeshBasicMaterial({
        color: 0x06b6d4, // Subtle Telemetry Cyan
        wireframe: true,
        transparent: true,
        opacity: 0.18,
      });
      const meshSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sceneGroup.add(meshSphere);

      // Inner Core Geodesic Lattice (Steel-Blue)
      const innerGeometry = new THREE.IcosahedronGeometry(5.2, 2);
      const innerMaterial = new THREE.MeshBasicMaterial({
        color: 0x3b82f6, // Cyber Steel-Blue
        wireframe: true,
        transparent: true,
        opacity: 0.12,
      });
      const innerSphere = new THREE.Mesh(innerGeometry, innerMaterial);
      sceneGroup.add(innerSphere);

      // 2. Fluid 3D Particle Array (Telemetry Constellation)
      const particleCount = 650;
      const particleGeometry = new THREE.BufferGeometry();
      const particlePositions = new Float32Array(particleCount * 3);
      const particleColors = new Float32Array(particleCount * 3);

      const colorCyan = new THREE.Color(0x06b6d4);
      const colorSteelBlue = new THREE.Color(0x1e3a8a);
      const colorMuted = new THREE.Color(0x0e7490);

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        // Distribute in a spherical cloud around the central mesh
        const radius = 10 + Math.random() * 22;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);

        particlePositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        particlePositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        particlePositions[i3 + 2] = radius * Math.cos(phi);

        // Subtle gradient between cyan and steel-blue
        const mix = Math.random();
        const c = mix < 0.6 ? colorCyan : mix < 0.85 ? colorSteelBlue : colorMuted;
        particleColors[i3] = c.r;
        particleColors[i3 + 1] = c.g;
        particleColors[i3 + 2] = c.b;
      }

      particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
      particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

      // Circular Point Texture for soft telemetry dust
      const canvas = document.createElement('canvas');
      canvas.width = 16;
      canvas.height = 16;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
        grad.addColorStop(0, 'rgba(255,255,255,1)');
        grad.addColorStop(0.5, 'rgba(6,182,212,0.6)');
        grad.addColorStop(1, 'rgba(6,182,212,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(8, 8, 8, 0, Math.PI * 2);
        ctx.fill();
      }
      const pointTexture = new THREE.CanvasTexture(canvas);

      const particleMaterial = new THREE.PointsMaterial({
        size: 0.35,
        vertexColors: true,
        map: pointTexture,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const particlePoints = new THREE.Points(particleGeometry, particleMaterial);
      sceneGroup.add(particlePoints);

      // Responsive Resize Listener
      const handleResize = () => {
        if (!container || !renderer) return;
        const width = container.clientWidth;
        const height = container.clientHeight;
        camera.aspect = width / Math.max(height, 1);
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };
      window.addEventListener('resize', handleResize);

      // Subtle Ambient Mouse Interaction
      let mouseX = 0;
      let mouseY = 0;
      let targetX = 0;
      let targetY = 0;

      const handleMouseMove = (event) => {
        const windowHalfX = window.innerWidth / 2;
        const windowHalfY = window.innerHeight / 2;
        targetX = (event.clientX - windowHalfX) * 0.0003;
        targetY = (event.clientY - windowHalfY) * 0.0003;
      };
      window.addEventListener('mousemove', handleMouseMove, { passive: true });

      // Animation Loop
      const startTime = performance.now();

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);

        const elapsedTime = (performance.now() - startTime) * 0.001;

        // 1. Slow, ambient rotation keyframes
        meshSphere.rotation.y = elapsedTime * 0.045;
        meshSphere.rotation.x = Math.sin(elapsedTime * 0.03) * 0.15;

        innerSphere.rotation.y = -elapsedTime * 0.06;
        innerSphere.rotation.z = Math.cos(elapsedTime * 0.04) * 0.18;

        particlePoints.rotation.y = elapsedTime * 0.02;
        particlePoints.rotation.x = Math.cos(elapsedTime * 0.025) * 0.1;

        // 2. Vertex deformation / fluid mesh morphing
        const pos = sphereGeometry.attributes.position;
        for (let i = 0; i < pos.count; i++) {
          const u = i * 3;
          const origX = originalPositions[u];
          const origY = originalPositions[u + 1];
          const origZ = originalPositions[u + 2];

          // Compute distance and subtle wave displacement
          const dist = Math.sqrt(origX * origX + origY * origY + origZ * origZ);
          const wave = Math.sin(dist * 0.8 + elapsedTime * 1.5) * 0.22;
          const scale = 1 + wave / dist;

          pos.array[u] = origX * scale;
          pos.array[u + 1] = origY * scale;
          pos.array[u + 2] = origZ * scale;
        }
        pos.needsUpdate = true;

        // 3. Smooth camera parallax lag
        mouseX += (targetX - mouseX) * 0.04;
        mouseY += (targetY - mouseY) * 0.04;
        sceneGroup.position.x = mouseX * 12;
        sceneGroup.position.y = -mouseY * 12;

        if (renderer) {
          renderer.render(scene, camera);
        }
      };

      animate();

      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('mousemove', handleMouseMove);
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        if (renderer && renderer.domElement && renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
        sphereGeometry.dispose();
        sphereMaterial.dispose();
        innerGeometry.dispose();
        innerMaterial.dispose();
        particleGeometry.dispose();
        particleMaterial.dispose();
        pointTexture.dispose();
        renderer?.dispose();
      };
    } catch (err) {
      console.warn('WebGL initialization fallback for LiquidGlassBackground3D:', err);
    }
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
      style={{
        background: 'radial-gradient(circle at 50% 30%, rgba(15, 23, 42, 0.45) 0%, rgba(3, 7, 18, 0.95) 100%)',
      }}
    />
  );
};

export default LiquidGlassBackground3D;
