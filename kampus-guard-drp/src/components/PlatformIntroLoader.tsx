import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface PlatformIntroLoaderProps {
  onComplete: () => void;
}

export const PlatformIntroLoader: React.FC<PlatformIntroLoaderProps> = ({ onComplete }) => {
  // Phase 1 (0:00 - 0:02): Bootup, spinning 3D wireframe mesh sphere, typewriter matrix
  // Phase 2 (0:02 - 0:05): Transition sweep to abstract shield vector, typography reveal, enter button
  const [phase, setPhase] = useState<1 | 2>(1);
  const [typedText, setTypedText] = useState<string>('');
  const [isExiting, setIsExiting] = useState<boolean>(false);
  const [shieldVisible, setShieldVisible] = useState<boolean>(false);
  const [contentReady, setContentReady] = useState<boolean>(false);

  const canvasMountRef = useRef<HTMLDivElement>(null);
  const phase1TargetText = 'SYNTHESIZING PERIMETER SURVEILLANCE MATRIX...';

  // -------------------------------------------------------------
  // PHASE 1: Typewriter Matrix Banner
  // -------------------------------------------------------------
  useEffect(() => {
    let charIndex = 0;
    const typingInterval = setInterval(() => {
      if (charIndex <= phase1TargetText.length) {
        setTypedText(phase1TargetText.slice(0, charIndex));
        charIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 42);

    return () => clearInterval(typingInterval);
  }, []);

  // -------------------------------------------------------------
  // Timeline Controller: Phase 1 -> Phase 2 Transition at 2.0s
  // -------------------------------------------------------------
  useEffect(() => {
    // Transition to Phase 2 at exactly 2000ms
    const phase2Timer = setTimeout(() => {
      setPhase(2);
      setShieldVisible(true);
    }, 2000);

    // Fade in text & button reveal
    const readyTimer = setTimeout(() => {
      setContentReady(true);
    }, 2300);

    return () => {
      clearTimeout(phase2Timer);
      clearTimeout(readyTimer);
    };
  }, []);

  // -------------------------------------------------------------
  // Hardware-Accelerated 3D Wireframe Mesh Sphere (Three.js)
  // -------------------------------------------------------------
  useEffect(() => {
    if (!canvasMountRef.current) return;
    const container = canvasMountRef.current;

    const width = 360;
    const height = 360;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 110;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Outer 3D Wireframe Mesh Sphere
    const sphereGeom = new THREE.SphereGeometry(32, 22, 16);
    const sphereWire = new THREE.WireframeGeometry(sphereGeom);
    const sphereMat = new THREE.LineBasicMaterial({
      color: 0x06b6d4, // Neon Cyan
      transparent: true,
      opacity: 0.75,
      linewidth: 1,
    });
    const sphereMesh = new THREE.LineSegments(sphereWire, sphereMat);
    rootGroup.add(sphereMesh);

    // 2. Nested 3D Icosahedron Core (Deep Purple)
    const icosaGeom = new THREE.IcosahedronGeometry(20, 1);
    const icosaWire = new THREE.WireframeGeometry(icosaGeom);
    const icosaMat = new THREE.LineBasicMaterial({
      color: 0xa855f7, // Deep Purple
      transparent: true,
      opacity: 0.65,
    });
    const icosaMesh = new THREE.LineSegments(icosaWire, icosaMat);
    rootGroup.add(icosaMesh);

    // 3. Gyroscopic Multi-Axis Orbiting Rings
    const ring1Geom = new THREE.RingGeometry(40, 41.2, 64);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8, // Sky Blue
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5,
    });
    const ring1 = new THREE.Mesh(ring1Geom, ring1Mat);
    ring1.rotation.x = Math.PI / 4;
    rootGroup.add(ring1);

    const ring2Geom = new THREE.RingGeometry(45, 46.2, 64);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0x818cf8, // Indigo
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4,
    });
    const ring2 = new THREE.Mesh(ring2Geom, ring2Mat);
    ring2.rotation.y = Math.PI / 3;
    ring2.rotation.x = -Math.PI / 6;
    rootGroup.add(ring2);

    // 4. Stardust Security Nodes / Vertices
    const particleCount = 75;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const radius = 35 + Math.random() * 20;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;
      positions[i * 3] = radius * Math.cos(phi) * Math.sin(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi);
      positions[i * 3 + 2] = radius * Math.cos(phi) * Math.cos(theta);
    }
    const particleGeom = new THREE.BufferGeometry();
    particleGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x67e8f9,
      size: 1.6,
      transparent: true,
      opacity: 0.8,
    });
    const particles = new THREE.Points(particleGeom, particleMat);
    rootGroup.add(particles);

    // Animation Loop with Multi-Axis Rotation & Phase 2 Sweep
    let animId: number;
    let startTime = performance.now();

    const renderLoop = () => {
      animId = requestAnimationFrame(renderLoop);
      const elapsed = (performance.now() - startTime) * 0.001;

      // Multi-axis internal rotations
      sphereMesh.rotation.y = elapsed * 0.55;
      sphereMesh.rotation.x = elapsed * 0.28;

      icosaMesh.rotation.y = -elapsed * 0.7;
      icosaMesh.rotation.z = elapsed * 0.4;

      ring1.rotation.z = elapsed * 0.6;
      ring1.rotation.y = Math.sin(elapsed * 0.7) * 0.4;

      ring2.rotation.x = elapsed * 0.5;
      ring2.rotation.z = Math.cos(elapsed * 0.6) * 0.5;

      particles.rotation.y = elapsed * 0.2;
      particles.rotation.x = elapsed * 0.1;

      // Phase 2 scaling sweep: after 2.0s, expand sphere smoothly
      if (elapsed > 2.0) {
        const sweepFactor = Math.min((elapsed - 2.0) * 1.2, 1.0);
        const targetScale = 1.0 + sweepFactor * 0.35;
        rootGroup.scale.set(targetScale, targetScale, targetScale);
        
        // Soften opacity as shield vector takes primary focus
        sphereMat.opacity = Math.max(0.75 - sweepFactor * 0.5, 0.25);
        icosaMat.opacity = Math.max(0.65 - sweepFactor * 0.45, 0.2);
        ring1Mat.opacity = Math.max(0.5 - sweepFactor * 0.3, 0.2);
      }

      renderer.render(scene, camera);
    };

    renderLoop();

    return () => {
      cancelAnimationFrame(animId);
      renderer.dispose();
      sphereGeom.dispose();
      icosaGeom.dispose();
      ring1Geom.dispose();
      ring2Geom.dispose();
      particleGeom.dispose();
    };
  }, []);

  // -------------------------------------------------------------
  // System Unmount Routing
  // Trigger hardware-accelerated fade-out transition, then unmount
  // -------------------------------------------------------------
  const handleEnterSecurityInterface = () => {
    setIsExiting(true);
    setTimeout(() => {
      onComplete();
    }, 700);
  };

  return (
    <div
      id="drp-platform-intro-loader"
      className={`fixed inset-0 z-[99999] bg-[#060b13] flex flex-col items-center justify-center overflow-hidden select-none transition-all duration-700 ease-out ${
        isExiting ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{
        backgroundImage: `
          radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.12) 0%, transparent 65%),
          radial-gradient(circle at 50% 70%, rgba(168, 85, 247, 0.10) 0%, transparent 70%),
          linear-gradient(to bottom, #060b13 0%, #03070d 100%)
        `,
      }}
    >
      {/* Background Cyber Grid Lines */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(56, 189, 248, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(56, 189, 248, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Cyber Sweep Scanline */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="w-full h-24 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent animate-pulse" />
      </div>

      {/* Top Telemetry Header Badge */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-3 px-4 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-950/30 backdrop-blur-md">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        <span className="text-[11px] font-mono tracking-widest text-cyan-300 uppercase">
          SEC_INIT // DRP_PERIMETER_BOOTLOADER_v3.2
        </span>
      </div>

      {/* Center 3D Engine & Morphing Shield Stage */}
      <div className="relative flex items-center justify-center w-[360px] h-[360px] my-auto">
        {/* Soft Ambient Radiating Glow Pulses */}
        <div className="absolute w-72 h-72 rounded-full bg-cyan-500/15 blur-3xl animate-pulse pointer-events-none" />
        <div className="absolute w-60 h-60 rounded-full bg-purple-600/15 blur-2xl animate-pulse pointer-events-none delay-500" />

        {/* Outer Radiating Concentric Pulse Rings */}
        <div className="absolute w-80 h-80 rounded-full border border-cyan-500/15 animate-ping pointer-events-none" style={{ animationDuration: '3.5s' }} />
        <div className="absolute w-96 h-96 rounded-full border border-purple-500/10 animate-ping pointer-events-none" style={{ animationDuration: '5s' }} />

        {/* Three.js 3D Wireframe Canvas Mount */}
        <div ref={canvasMountRef} className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none" />

        {/* Phase 2: Vector Protection Shield Morph Overlay */}
        <div 
          className={`absolute z-20 transition-all duration-1000 ease-out flex items-center justify-center pointer-events-none ${
            shieldVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
          }`}
        >
          <div className="relative w-28 h-28 flex items-center justify-center">
            {/* Ambient Shield Glow */}
            <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-xl animate-pulse" />
            
            {/* High-Fidelity Cyber Shield Vector */}
            <svg 
              className="w-24 h-24 text-cyan-400 drop-shadow-[0_0_20px_rgba(6,182,212,0.85)]"
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5"
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="rgba(6, 182, 212, 0.12)" />
              <path d="M12 8v8" stroke="rgba(255, 255, 255, 0.9)" strokeWidth="2" />
              <path d="M8 12h8" stroke="rgba(255, 255, 255, 0.9)" strokeWidth="2" />
              <circle cx="12" cy="12" r="2.5" fill="#38bdf8" stroke="none" />
            </svg>

            {/* Orbiting Reticle Brackets */}
            <div className="absolute -inset-2 border border-cyan-400/30 rounded-2xl animate-spin pointer-events-none" style={{ animationDuration: '14s' }} />
          </div>
        </div>
      </div>

      {/* Identity & Scope Reveal Block (Phase 2) */}
      <div className="relative z-30 flex flex-col items-center text-center px-6 max-w-2xl mt-[-24px] mb-8">
        {/* Primary Identity Header with Sharp Glowing Text Shadow Layer */}
        <h1 
          className={`text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-wider transition-all duration-700 ease-out ${
            contentReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{
            fontFamily: "'Space Grotesk', 'Plus Jakarta Sans', sans-serif",
            background: 'linear-gradient(135deg, #ffffff 0%, #38bdf8 50%, #c084fc 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 25px rgba(6, 182, 212, 0.75), 0 0 45px rgba(168, 85, 247, 0.35)',
            letterSpacing: '0.08em',
          }}
        >
          DIGITAL RISK PROTECTION PLATFORM
        </h1>

        {/* Subheader Meta */}
        <p 
          className={`text-xs md:text-sm text-slate-300 leading-relaxed mt-3 max-w-xl transition-all duration-700 delay-150 ease-out font-normal ${
            contentReady ? 'opacity-90 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          One unified AI security workspace for threat surveillance, rogue APK repository monitoring, and real-time social impersonation triage — deployed globally.
        </p>

        {/* Mechanical Typewriter Matrix Banner */}
        <div className="mt-5 flex items-center justify-center gap-2 h-6">
          <span className="text-[12px] font-mono tracking-widest text-cyan-400 font-medium">
            {phase === 1 ? typedText : 'SURVEILLANCE MATRIX ACTIVE // SECURITY CLEARANCE GRANTED'}
          </span>
          <span className="w-1.5 h-3.5 bg-cyan-400 inline-block animate-pulse" />
        </div>

        {/* Navigation Trigger: Glassmorphic Operational Block Button */}
        <div 
          className={`mt-6 transition-all duration-700 delay-300 ease-out ${
            contentReady ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-95 pointer-events-none'
          }`}
        >
          <button
            id="btn-enter-security-interface"
            onClick={handleEnterSecurityInterface}
            className="relative group px-8 py-3.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 active:bg-cyan-500/30 border border-cyan-400/40 hover:border-cyan-300 text-cyan-300 hover:text-white font-mono text-xs md:text-sm tracking-widest uppercase transition-all duration-300 shadow-[0_0_30px_rgba(6,182,212,0.25)] hover:shadow-[0_0_50px_rgba(6,182,212,0.6)] cursor-pointer backdrop-blur-xl flex items-center gap-3 overflow-hidden"
          >
            {/* Shimmer sweep effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent pointer-events-none" />

            <span className="text-cyan-400 font-bold group-hover:translate-x-[-2px] transition-transform">[</span>
            <span className="font-semibold tracking-wider drop-shadow-[0_0_10px_rgba(6,182,212,0.6)]">
              ENTER SECURITY INTERFACE
            </span>
            <span className="text-cyan-400 font-bold group-hover:translate-x-[2px] transition-transform">]</span>
          </button>
        </div>
      </div>

      {/* Bottom Telemetry Footer */}
      <div className="absolute bottom-4 flex items-center justify-between w-full px-8 text-[10px] font-mono text-slate-500">
        <span>SECURITY PROTOCOL: ZERO_TRUST_v2</span>
        <span>BYTEXL HACKATHON EVALUATION SUITE</span>
      </div>
    </div>
  );
};
