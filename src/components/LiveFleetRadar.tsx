import React, { useState, useEffect } from 'react';
import { useToast } from './Toast';

interface LiveFleetRadarProps {
  busNumber: string;
  speedKmh?: number;
  vehiclePlate?: string;
  lang: 'EN' | 'ZH';
}

export const LiveFleetRadar: React.FC<LiveFleetRadarProps> = ({
  busNumber,
  speedKmh = 32,
  vehiclePlate = 'SG5821K',
  lang,
}) => {
  const { showToast } = useToast();
  const [zoomLevel, setZoomLevel] = useState(1);
  const [layerMode, setLayerMode] = useState<'vector' | 'night' | 'satellite'>('vector');
  const [busProgress, setBusProgress] = useState(0.35); // 0 (far) to 0.72 (approaching stop)
  const [isCentered, setIsCentered] = useState(true);
  const [selectedPin, setSelectedPin] = useState<string | null>(null);

  // Subtle bus movement simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setBusProgress((prev) => {
        if (prev >= 0.75) return 0.25;
        return Number((prev + 0.02).toFixed(3));
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Compute position along the Orchard Road curve: M -20,190 Q 150,180 450,140
  // Quadratic bezier: B(t) = (1-t)^2 P0 + 2(1-t)t P1 + t^2 P2
  const p0 = { x: -20, y: 190 };
  const p1 = { x: 150, y: 180 };
  const p2 = { x: 450, y: 140 };

  const tVal = busProgress;
  const busX = Math.round((1 - tVal) ** 2 * p0.x + 2 * (1 - tVal) * tVal * p1.x + tVal ** 2 * p2.x);
  const busY = Math.round((1 - tVal) ** 2 * p0.y + 2 * (1 - tVal) * tVal * p1.y + tVal ** 2 * p2.y);

  const t = {
    EN: {
      radarTitle: 'Live Fleet Radar',
      gpsLock: 'GPS Lock: ±4m',
      you: 'You (120m away)',
      stopName: 'Stop 09038',
      speedLimit: 'Speed Limit: 50 km/h',
      junction: 'Orchard Blvd / Somerset Rd Junction',
      busLive: `Bus ${busNumber} Live`,
      myLocation: 'My Location',
      layerSwitched: (mode: string) => `Switched map to ${mode} mode`,
      recentered: 'Location radar recentered on Somerset Junction',
    },
    ZH: {
      radarTitle: '实时车队雷达',
      gpsLock: 'GPS定位锁定: ±4米',
      you: '您当前位置 (距离120米)',
      stopName: '09038 站',
      speedLimit: '路段限速: 50公里/小时',
      junction: '乌节林荫道 / 索美塞道路交叉口',
      busLive: `${busNumber}路 实时`,
      myLocation: '我的位置',
      layerSwitched: (mode: string) => `已切换为 ${mode} 图层`,
      recentered: '雷达已重置定位至索美塞站',
    },
  }[lang];

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.min(1.4, Math.max(0.8, Number((prev + delta).toFixed(1)))));
  };

  const cycleLayer = () => {
    const nextMode = layerMode === 'vector' ? 'night' : layerMode === 'night' ? 'satellite' : 'vector';
    setLayerMode(nextMode);
    showToast(t.layerSwitched(nextMode.toUpperCase()), 'info');
  };

  const handleRecenter = () => {
    setIsCentered(true);
    setZoomLevel(1);
    showToast(t.recentered, 'success');
  };

  return (
    <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-[#e2e8f0] flex flex-col gap-4">
      {/* Radar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#9e001f] text-[22px]">map</span>
          <span className="text-lg font-bold text-[#1c1b1b]">{t.radarTitle}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-[#0E8345]/10 text-[#0E8345] text-xs font-bold flex items-center gap-1.5 border border-[#0E8345]/20">
            <span className="h-1.5 w-1.5 rounded-full bg-[#0E8345] animate-ping"></span>
            {t.gpsLock}
          </span>
        </div>
      </div>

      {/* Stylized Radar Viewport */}
      <div
        className={`relative w-full h-[360px] md:h-[390px] rounded-lg overflow-hidden select-none border border-[#e2e8f0] transition-colors duration-300 ${
          layerMode === 'night'
            ? 'bg-[#0f172a]'
            : layerMode === 'satellite'
            ? 'bg-[#1e293b]'
            : 'bg-[#f4f6f9]'
        }`}
      >
        {/* Subtle grid background for tactile civic cartography feel */}
        <div
          className={`absolute inset-0 opacity-15 pointer-events-none ${
            layerMode === 'night' ? 'opacity-25' : ''
          }`}
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, #94a3b8 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Scalable Container for Vector Overlays */}
        <div
          className="absolute inset-0 w-full h-full transition-transform duration-300 origin-center"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* Stylized SVG Road & Route Vectors */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            {/* Orchard Road Trunk Vector Highway */}
            <path
              d="M -20,190 Q 150,180 450,140"
              fill="none"
              stroke={layerMode === 'night' ? '#334155' : '#cbd5e1'}
              strokeLinecap="round"
              strokeWidth="20"
            />
            {/* Transit Trunk active route dash */}
            <path
              d="M -20,190 Q 150,180 450,140"
              fill="none"
              stroke="#c8102e"
              strokeDasharray="8 6"
              strokeWidth="5"
            />

            {/* Somerset Cross Road */}
            <path
              d="M 220,-20 L 190,400"
              fill="none"
              stroke={layerMode === 'night' ? '#1e293b' : '#e2e8f0'}
              strokeWidth="14"
            />
            <path
              d="M 220,-20 L 190,400"
              fill="none"
              stroke="#406182"
              strokeDasharray="4 4"
              strokeWidth="2"
            />

            {/* Walking Proximity Halo around User */}
            <circle
              cx="210"
              cy="240"
              fill="rgba(64, 97, 130, 0.08)"
              r="56"
              stroke="#406182"
              strokeDasharray="4 4"
              strokeWidth="1.5"
            />

            {/* Walking Path Line connecting User to Bus Stop */}
            <path
              d="M 210,240 L 255,185"
              fill="none"
              stroke="#0E8345"
              strokeDasharray="3 3"
              strokeWidth="2"
            />
          </svg>

          {/* Map Floating Pin 1: User Pin (Opp Somerset Stn proximity) */}
          <div
            onClick={() => setSelectedPin('user')}
            className="absolute top-[230px] left-[200px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-auto cursor-pointer group"
          >
            <span className="px-2 py-0.5 rounded bg-[#1c1b1b] text-white text-[11px] font-bold shadow-md whitespace-nowrap mb-1">
              {t.you}
            </span>
            <div className="relative flex items-center justify-center">
              <span className="animate-ping absolute inline-flex h-6 w-6 rounded-full bg-[#406182] opacity-75"></span>
              <div className="w-4 h-4 rounded-full bg-[#406182] border-2 border-white shadow-md"></div>
            </div>
          </div>

          {/* Map Floating Pin 2: Opp Somerset Bus Stop Pin (Stop 09038) */}
          <div
            onClick={() => setSelectedPin('stop')}
            className="absolute top-[175px] left-[260px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-auto cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-full bg-[#c8102e] text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[18px]">directions_bus</span>
            </div>
            <span className="bg-white text-[#9e001f] text-[11px] font-bold px-2 py-0.5 rounded shadow border border-[#e2e8f0] mt-1 whitespace-nowrap">
              {t.stopName}
            </span>
          </div>

          {/* Map Floating Vehicle Badge: Dynamic Moving Bus */}
          <div
            onClick={() => setSelectedPin('bus')}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-auto cursor-pointer transition-all duration-1000 ease-out"
            style={{
              top: `${busY}px`,
              left: `${busX}px`,
            }}
          >
            <div className="bg-[#9e001f] text-white px-2 py-1 rounded-md shadow-xl flex items-center gap-1 text-xs font-black border border-white/40">
              <span className="material-symbols-outlined text-[13px] animate-pulse">near_me</span>
              <span>BUS {busNumber}</span>
            </div>
            <div className="bg-[#1c1b1b] text-white text-[10px] px-1.5 py-0.5 rounded shadow mt-0.5 font-bold">
              {speedKmh} km/h
            </div>
          </div>
        </div>

        {/* Selected Pin Telemetry Overlay Card */}
        {selectedPin && (
          <div className="absolute top-3 left-3 z-20 bg-white/95 backdrop-blur-md border border-[#e2e8f0] p-3 rounded-lg shadow-lg max-w-xs animate-in fade-in">
            <div className="flex items-center justify-between gap-2 border-b border-[#e2e8f0] pb-1.5 mb-1.5">
              <span className="text-xs font-bold text-[#1c1b1b]">
                {selectedPin === 'bus'
                  ? `Bus ${busNumber} Telemetry`
                  : selectedPin === 'stop'
                  ? 'Stop 09038 Details'
                  : 'Commuter GPS Beacon'}
              </span>
              <button
                onClick={() => setSelectedPin(null)}
                className="text-xs text-[#5c403f] hover:text-[#1c1b1b] font-bold"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-[#5c403f]">
              {selectedPin === 'bus' && (
                <>
                  Vehicle: <strong className="text-[#1c1b1b]">{vehiclePlate}</strong>
                  <br />
                  Speed: <strong className="text-[#1c1b1b]">{speedKmh} km/h</strong> (Eco Headway)
                  <br />
                  Model: ADL Enviro500 (Double Decker)
                </>
              )}
              {selectedPin === 'stop' && (
                <>
                  Opp Somerset Stn (Somerset Rd)
                  <br />
                  Sheltered Stop • Real-time Passenger Display
                  <br />
                  MRT: NS23 Somerset Exit B (120m)
                </>
              )}
              {selectedPin === 'user' && (
                <>
                  Accuracy: ±4m via Cellular & GPS
                  <br />
                  Walking Distance: 120m (approx 2 mins)
                </>
              )}
            </p>
          </div>
        )}

        {/* Map Floating Controls (Layer, Recenter, Zoom) */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
          <button
            onClick={cycleLayer}
            className="w-8 h-8 rounded bg-white shadow-md border border-[#e2e8f0] flex items-center justify-center text-[#1c1b1b] hover:bg-[#f6f3f2] transition-colors"
            title="Toggle Layer (Vector / Night / Satellite)"
          >
            <span className="material-symbols-outlined text-[18px]">layers</span>
          </button>
          <button
            onClick={handleRecenter}
            className="w-8 h-8 rounded bg-white shadow-md border border-[#e2e8f0] flex items-center justify-center text-[#1c1b1b] hover:bg-[#f6f3f2] transition-colors"
            title="Recenter Map"
          >
            <span className="material-symbols-outlined text-[18px]">my_location</span>
          </button>
          <div className="flex flex-col rounded bg-white shadow-md border border-[#e2e8f0] overflow-hidden">
            <button
              onClick={() => handleZoom(0.1)}
              className="w-8 h-8 flex items-center justify-center text-[#1c1b1b] hover:bg-[#f6f3f2] text-sm font-bold border-b border-[#e2e8f0]"
              title="Zoom In"
            >
              +
            </button>
            <button
              onClick={() => handleZoom(-0.1)}
              className="w-8 h-8 flex items-center justify-center text-[#1c1b1b] hover:bg-[#f6f3f2] text-sm font-bold"
              title="Zoom Out"
            >
              -
            </button>
          </div>
        </div>

        {/* Bottom Legend Overlay */}
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-lg shadow-sm border border-[#e2e8f0] flex items-center gap-3 text-xs text-[#1c1b1b] z-10 font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#9e001f]"></span>
            <span>{t.busLive}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#406182]"></span>
            <span>{t.myLocation}</span>
          </div>
        </div>
      </div>

      {/* Street Names & Speed Limit Indicator */}
      <div className="flex items-center justify-between text-xs text-[#5c403f] px-1 font-medium">
        <span>{t.junction}</span>
        <span className="text-[#9e001f] font-bold">{t.speedLimit}</span>
      </div>
    </div>
  );
};
