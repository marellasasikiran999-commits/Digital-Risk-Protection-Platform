import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  Smartphone, ShieldCheck, ShieldAlert, RotateCw, 
  Layers, AlertTriangle, Sliders
} from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

interface AppleDeviceStudio3DProps {
  brandName?: string;
}

export const AppleDeviceStudio3D: React.FC<AppleDeviceStudio3DProps> = ({
  brandName = 'Digital Risk Protection Platform'
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [deviceMode, setDeviceMode] = useState<'official' | 'malicious'>('malicious');
  const [finish, setFinish] = useState<'titanium' | 'space_black' | 'cyber_blue' | 'emerald'>('titanium');
  const [isExploded, setIsExploded] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);

  // Three.js object references for interactive manipulation
  const sceneRef = useRef<THREE.Scene | null>(null);
  const phoneGroupRef = useRef<THREE.Group | null>(null);
  const screenMeshRef = useRef<THREE.Mesh | null>(null);
  const chassisMeshRef = useRef<THREE.Mesh | null>(null);
  const layersGroupRef = useRef<THREE.Group | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  // Finishes palette
  const FINISH_COLORS = {
    titanium: { chassis: 0x8e8e93, rim: 0xb0b0b5, specular: 0xffffff },
    space_black: { chassis: 0x1c1c1e, rim: 0x2c2c2e, specular: 0xaaaaaa },
    cyber_blue: { chassis: 0x0f1f38, rim: 0x1e3a8a, specular: 0x38bdf8 },
    emerald: { chassis: 0x06281e, rim: 0x047857, specular: 0x34d399 }
  };

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 560;

    // 1. Scene, Camera, WebGL Renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 0, 110);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 2. Lighting (Apple Studio lighting setup)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(50, 60, 80);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    rimLight.position.set(-60, -40, -40);
    scene.add(rimLight);

    const bottomGlow = new THREE.PointLight(0x818cf8, 1.0, 150);
    bottomGlow.position.set(0, -50, 40);
    scene.add(bottomGlow);

    // 3. Phone Hierarchy
    const phoneGroup = new THREE.Group();
    scene.add(phoneGroup);
    phoneGroupRef.current = phoneGroup;

    // Dimensions for modern smartphone chassis (approx iPhone Pro ratio)
    const PHONE_W = 34;
    const PHONE_H = 68;
    const PHONE_D = 4.2;

    // Chassis (Rounded Box or Extruded Shape)
    const shape = new THREE.Shape();
    const radius = 5;
    const x = -PHONE_W / 2;
    const y = -PHONE_H / 2;
    shape.moveTo(x + radius, y);
    shape.lineTo(x + PHONE_W - radius, y);
    shape.quadraticCurveTo(x + PHONE_W, y, x + PHONE_W, y + radius);
    shape.lineTo(x + PHONE_W, y + PHONE_H - radius);
    shape.quadraticCurveTo(x + PHONE_W, y + PHONE_H, x + PHONE_W - radius, y + PHONE_H);
    shape.lineTo(x + radius, y + PHONE_H);
    shape.quadraticCurveTo(x, y + PHONE_H, x, y + PHONE_H - radius);
    shape.lineTo(x, y + radius);
    shape.quadraticCurveTo(x, y, x + radius, y);

    const extrudeSettings = {
      depth: PHONE_D,
      bevelEnabled: true,
      bevelSegments: 6,
      steps: 1,
      bevelSize: 1.2,
      bevelThickness: 1.2
    };

    const chassisGeom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    chassisGeom.center();

    const currentColors = FINISH_COLORS[finish];
    const chassisMat = new THREE.MeshStandardMaterial({
      color: currentColors.chassis,
      metalness: 0.9,
      roughness: 0.15,
      envMapIntensity: 1.5
    });
    const chassisMesh = new THREE.Mesh(chassisGeom, chassisMat);
    phoneGroup.add(chassisMesh);
    chassisMeshRef.current = chassisMesh;

    // Screen Glass
    const screenShape = new THREE.Shape();
    const sRad = 4.2;
    const sx = -PHONE_W * 0.46;
    const sy = -PHONE_H * 0.46;
    const sw = PHONE_W * 0.92;
    const sh = PHONE_H * 0.92;
    screenShape.moveTo(sx + sRad, sy);
    screenShape.lineTo(sx + sw - sRad, sy);
    screenShape.quadraticCurveTo(sx + sw, sy, sx + sw, sy + sRad);
    screenShape.lineTo(sx + sw, sy + sh - sRad);
    screenShape.quadraticCurveTo(sx + sw, sy + sh, sx + sw - sRad, sy + sh);
    screenShape.lineTo(sx + sRad, sy + sh);
    screenShape.quadraticCurveTo(sx, sy + sh, sx, sy + sh - sRad);
    screenShape.lineTo(sx, sy + sRad);
    screenShape.quadraticCurveTo(sx, sy, sx + sRad, sy);

    const screenGeom = new THREE.ShapeGeometry(screenShape);
    const screenMat = new THREE.MeshStandardMaterial({
      color: deviceMode === 'official' ? 0x064e3b : 0x4c0519,
      roughness: 0.1,
      metalness: 0.3,
      emissive: deviceMode === 'official' ? 0x022c22 : 0x2e020d,
      emissiveIntensity: 0.8
    });
    const screenMesh = new THREE.Mesh(screenGeom, screenMat);
    screenMesh.position.z = PHONE_D / 2 + 1.25;
    phoneGroup.add(screenMesh);
    screenMeshRef.current = screenMesh;

    // Dynamic Island / Notch
    const notchGeom = new THREE.CapsuleGeometry(1.2, 5.5, 8, 16);
    const notchMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const notchMesh = new THREE.Mesh(notchGeom, notchMat);
    notchMesh.rotation.z = Math.PI / 2;
    notchMesh.position.set(0, PHONE_H * 0.42, PHONE_D / 2 + 1.3);
    phoneGroup.add(notchMesh);

    // 4. Exploded Layers Inspection Group (Holographic Intercept Wireframe)
    const layersGroup = new THREE.Group();
    layersGroup.position.z = 0;
    phoneGroup.add(layersGroup);
    layersGroupRef.current = layersGroup;

    // Layer 1: Permissions Shield Grid
    const gridHelper = new THREE.GridHelper(30, 10, 0x38bdf8, 0x1e3a8a);
    gridHelper.rotation.x = Math.PI / 2;
    gridHelper.position.z = 10;
    gridHelper.visible = false;
    layersGroup.add(gridHelper);

    // Layer 2: Trojan Intercept Banner
    const bannerGeom = new THREE.PlaneGeometry(28, 10);
    const bannerMat = new THREE.MeshBasicMaterial({
      color: 0xf43f5e,
      wireframe: true,
      transparent: true,
      opacity: 0.6
    });
    const bannerMesh = new THREE.Mesh(bannerGeom, bannerMat);
    bannerMesh.position.set(0, -10, 18);
    bannerMesh.visible = false;
    layersGroup.add(bannerMesh);

    // 5. Interactive Mouse Drag Orbit Controls
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !phoneGroupRef.current) return;
      const deltaX = e.clientX - prevMousePos.x;
      const deltaY = e.clientY - prevMousePos.y;

      phoneGroupRef.current.rotation.y += deltaX * 0.008;
      phoneGroupRef.current.rotation.x += deltaY * 0.008;

      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (!cameraRef.current) return;
      cameraRef.current.position.z += e.deltaY * 0.1;
      cameraRef.current.position.z = Math.max(70, Math.min(180, cameraRef.current.position.z));
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    dom.addEventListener('wheel', onWheel, { passive: false });

    // 6. Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth auto-rotation if idle
      if (autoRotate && !isDragging && phoneGroupRef.current) {
        phoneGroupRef.current.rotation.y = Math.sin(elapsed * 0.4) * 0.35;
        phoneGroupRef.current.rotation.x = Math.sin(elapsed * 0.25) * 0.12;
      }

      // Smooth Exploded Layer transition
      if (screenMeshRef.current && layersGroupRef.current) {
        const targetZ = isExploded ? 22 : PHONE_D / 2 + 1.25;
        screenMeshRef.current.position.z += (targetZ - screenMeshRef.current.position.z) * 0.08;

        gridHelper.visible = isExploded;
        bannerMesh.visible = isExploded && deviceMode === 'malicious';
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current || !cameraRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight || 560;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('wheel', onWheel);
      renderer.dispose();
    };
  }, [finish, deviceMode, isExploded, autoRotate]);

  return (
    <div className="space-y-6">
      {/* Apple-style Top Showcase Header */}
      <Card className="p-6 relative overflow-hidden backdrop-blur-2xl bg-gradient-to-r from-blue-950/40 via-[#0a1020] to-[#070b16] border-blue-500/20 card-glow-top">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="cyber">
                Apple-Grade 3D Device Studio
              </Badge>
              <Badge variant={deviceMode === 'official' ? 'success' : 'destructive'}>
                {deviceMode === 'official' ? 'Verified Official App' : 'Impostor Trojan Overlay'}
              </Badge>
            </div>
            <h2 className="text-xl font-black text-white mt-1.5 tracking-tight font-sans">
              Interactive 3D Mobile Impersonation Inspector
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Click &amp; drag the device to inspect 360° hardware angles. Toggle between legitimate official apps and deceptive Trojan clones in real-time WebGL.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Mode Switcher */}
            <div className="bg-[#0b1222]/90 border border-slate-800 p-1 rounded-xl flex items-center gap-1 font-cyber">
              <button
                onClick={() => setDeviceMode('official')}
                className={`text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                  deviceMode === 'official'
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Official App</span>
              </button>
              <button
                onClick={() => setDeviceMode('malicious')}
                className={`text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                  deviceMode === 'malicious'
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Malicious Clone</span>
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Main 3D Studio Canvas & Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 3D WebGL Canvas (Col Span 8) */}
        <Card className="lg:col-span-8 p-0 overflow-hidden relative shadow-2xl min-h-[580px] bg-[#050811]/90 border-slate-800 flex flex-col justify-between">
          {/* Top Control Bar */}
          <div className="p-4 flex items-center justify-between z-20 pointer-events-auto">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="gap-1.5 py-1 px-3 bg-slate-900/80 backdrop-blur-md">
                <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                <span>6.7&quot; Super Retina XDR Canvas</span>
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsExploded(!isExploded)}
                className={`font-cyber text-[11px] h-8 ${isExploded ? 'border-cyan-500/50 text-cyan-300 bg-cyan-950/30' : ''}`}
                title="Explode 3D glass layers to view underlying Trojan permissions"
              >
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>{isExploded ? 'Layers Exploded' : 'Explode 3D Layers'}</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setAutoRotate(!autoRotate)}
                className="font-cyber text-[11px] h-8"
              >
                <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
                <span>{autoRotate ? 'Orbit On' : 'Orbit Paused'}</span>
              </Button>
            </div>
          </div>

          {/* Three.js Device Mount */}
          <div
            ref={mountRef}
            className="w-full h-[480px] cursor-grab active:cursor-grabbing relative z-10"
          />

          {/* Bottom Apple Finish Selector & Dock */}
          <div className="p-4 border-t border-slate-800/80 bg-[#080d1a]/80 backdrop-blur-md flex items-center justify-between z-20 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-cyber text-slate-400 uppercase font-bold">Titanium Finish:</span>
              <div className="flex items-center gap-2">
                {(['titanium', 'space_black', 'cyber_blue', 'emerald'] as const).map((col) => (
                  <button
                    key={col}
                    onClick={() => setFinish(col)}
                    className={`w-5 h-5 rounded-full border-2 transition-transform ${
                      finish === col ? 'scale-125 border-cyan-400 ring-2 ring-cyan-500/30' : 'border-slate-700 hover:scale-110'
                    }`}
                    style={{
                      backgroundColor:
                        col === 'titanium' ? '#8e8e93' :
                        col === 'space_black' ? '#1c1c1e' :
                        col === 'cyber_blue' ? '#1e3a8a' : '#047857'
                    }}
                    title={col.replace('_', ' ').toUpperCase()}
                  />
                ))}
              </div>
            </div>

            <span className="text-slate-500 text-[10px] font-cyber">
              Click &amp; Drag 360° • Scroll Wheel to Zoom
            </span>
          </div>
        </Card>

        {/* Right Inspection HUD (Col Span 4) */}
        <Card className="lg:col-span-4 p-6 space-y-4 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" /> Device Inspection Telemetry
              </h3>
              <Badge variant={deviceMode === 'official' ? 'success' : 'destructive'}>
                {deviceMode === 'official' ? 'SAFE' : 'CRITICAL THREAT'}
              </Badge>
            </div>

            {deviceMode === 'official' ? (
              <div className="space-y-4 mt-4 text-xs">
                {/* Official Verdict */}
                <div className="p-4 rounded-xl border border-emerald-800/60 bg-emerald-950/30 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider block font-cyber text-emerald-300">
                      OFFICIAL APPLICATION CERTIFICATE
                    </span>
                    <span className="text-sm font-bold text-white mt-0.5 block">
                      {brandName} Mobile
                    </span>
                    <span className="text-[11px] text-slate-400 block font-cyber mt-0.5">
                      Publisher: {brandName}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-black font-cyber text-emerald-400">0</span>
                    <span className="text-[10px] block opacity-80 font-cyber">/ 100 Risk</span>
                  </div>
                </div>

                <div className="bg-[#0b1222]/80 p-4 rounded-xl border border-slate-800 space-y-2.5 font-cyber text-[11px]">
                  <div className="flex justify-between py-1 border-b border-slate-800/80">
                    <span className="text-slate-400">Package Identifier:</span>
                    <span className="text-cyan-300 font-bold">com.digitalrisk.app</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/80">
                    <span className="text-slate-400">Publisher Signature:</span>
                    <span className="text-emerald-400 font-bold">VERIFIED (Google Play)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/80">
                    <span className="text-slate-400">Overlay Permissions:</span>
                    <span className="text-emerald-400 font-bold">NONE (Clean)</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">False Positive Guard:</span>
                    <span className="text-emerald-300 font-bold">0% FP Baseline Excluded</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 mt-4 text-xs">
                {/* Malicious Clone Verdict */}
                <div className="p-4 rounded-xl border border-rose-800/60 bg-rose-950/30 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider block font-cyber text-rose-300">
                      MALICIOUS ROGUE CLONE CONFIRMED
                    </span>
                    <span className="text-sm font-bold text-white mt-0.5 block">
                      Digital Risk Protection Rewards Pro
                    </span>
                    <span className="text-[11px] text-slate-400 block font-cyber mt-0.5">
                      Publisher: Rogue Dev Syndicate Ltd
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-black font-cyber text-rose-400">97</span>
                    <span className="text-[10px] block opacity-80 font-cyber">/ 100 Risk</span>
                  </div>
                </div>

                {/* Threat Interceptions */}
                <div className="bg-[#0b1222]/80 p-4 rounded-xl border border-slate-800 space-y-2.5 font-cyber text-[11px]">
                  <div className="flex justify-between py-1 border-b border-slate-800/80">
                    <span className="text-slate-400">Attack Mechanism:</span>
                    <span className="text-rose-400 font-bold">Phishing Screen Overlay</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/80">
                    <span className="text-slate-400">Flagged Permission:</span>
                    <span className="text-rose-400 font-bold">SYSTEM_ALERT_WINDOW</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/80">
                    <span className="text-slate-400">SMS Stealer Capability:</span>
                    <span className="text-rose-400 font-bold">RECEIVE_SMS (2FA OTP)</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Classification:</span>
                    <span className="text-rose-300 font-bold">Trojan-Banker.AndroidOS</span>
                  </div>
                </div>

                <div className="bg-[#0b1222]/80 p-3.5 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-1">
                  <span className="text-slate-400 font-cyber font-bold block uppercase">Explode 3D Layers to See:</span>
                  <p className="text-slate-300 text-[10px] leading-relaxed">
                    Click the <strong>Explode 3D Layers</strong> button on the canvas to inspect the malicious overlay screen floating over the genuine mobile UI.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-800">
            <Button
              variant={deviceMode === 'official' ? 'outline' : 'destructive'}
              size="sm"
              className="w-full"
              onClick={() => {
                if (deviceMode === 'official') {
                  alert(`Official App Verified! Keystore SHA-256 matches baseline for ${brandName}.`);
                } else {
                  alert(`Google Play Protect Enforcement Ticket Dispatched for Rogue Clone!`);
                }
              }}
            >
              {deviceMode === 'official' ? <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> : <AlertTriangle className="w-3.5 h-3.5" />}
              <span>{deviceMode === 'official' ? 'Validate Whitelist Baseline' : 'Dispatch Google Play Takedown'}</span>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
