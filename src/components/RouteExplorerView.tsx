import React, { useState } from 'react';
import { BUS_ROUTES } from '../data/transitData';

interface RouteExplorerViewProps {
  selectedBus: string;
  setSelectedBus: (bus: string) => void;
  lang: 'EN' | 'ZH';
}

export const RouteExplorerView: React.FC<RouteExplorerViewProps> = ({
  selectedBus,
  setSelectedBus,
  lang,
}) => {
  const [direction, setDirection] = useState<1 | 2>(1);

  const availableBuses = ['14', '65', '123', '174', '190'];
  const route = BUS_ROUTES[selectedBus] || BUS_ROUTES['65'];
  const stops = direction === 1 ? route.stopsDir1 : route.stopsDir2;

  const t = {
    EN: {
      heading: 'Singapore Bus Route Explorer',
      subheading: 'Official route alignment, sequential boarding berths & MRT interchanges',
      operatingHours: 'Operating Hours',
      peakHeadway: 'Peak Headway',
      offPeakHeadway: 'Off-Peak Headway',
      operator: 'Operator',
      stopsCount: (n: number) => `${n} Selected Key Stops shown`,
      transferMRT: 'Interchange:',
    },
    ZH: {
      heading: '新加坡巴士路线探索',
      subheading: '官方路线规划、途经站点及地铁换乘信息',
      operatingHours: '运营时间',
      peakHeadway: '高峰班次',
      offPeakHeadway: '平峰班次',
      operator: '运营公司',
      stopsCount: (n: number) => `显示 ${n} 个主要站点`,
      transferMRT: '地铁换乘:',
    },
  }[lang];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-6 flex flex-col gap-6">
      {/* Route Selector & Header */}
      <div className="bg-white rounded-xl p-5 md:p-6 border border-[#e2e8f0] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#9e001f] uppercase tracking-wider">
            <span className="material-symbols-outlined text-[16px]">alt_route</span>
            <span>{t.heading}</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-[#1c1b1b] mt-1">
            Service {route.serviceNo}: {direction === 1 ? route.direction1Name : route.direction2Name}
          </h1>
          <p className="text-xs text-[#5c403f] mt-0.5">{t.subheading}</p>
        </div>

        {/* Bus switcher buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {availableBuses.map((bus) => (
            <button
              key={bus}
              onClick={() => setSelectedBus(bus)}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-bold transition-all ${
                selectedBus === bus
                  ? 'bg-[#c8102e] text-white shadow-xs'
                  : 'bg-[#f0edec] text-[#1c1b1b] hover:bg-[#ebe7e7]'
              }`}
            >
              {bus}
            </button>
          ))}
        </div>
      </div>

      {/* Direction & Schedule Info Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-[#e2e8f0] shadow-xs flex flex-col">
          <span className="text-[11px] font-bold text-[#5c403f] uppercase">{t.operatingHours}</span>
          <span className="text-sm font-bold text-[#1c1b1b] mt-1">{route.operatingHours}</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-[#e2e8f0] shadow-xs flex flex-col">
          <span className="text-[11px] font-bold text-[#5c403f] uppercase">{t.peakHeadway}</span>
          <span className="text-sm font-bold text-[#0E8345] mt-1">{route.headwayPeak}</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-[#e2e8f0] shadow-xs flex flex-col">
          <span className="text-[11px] font-bold text-[#5c403f] uppercase">{t.offPeakHeadway}</span>
          <span className="text-sm font-bold text-[#1c1b1b] mt-1">{route.headwayOffPeak}</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-[#e2e8f0] shadow-xs flex flex-col">
          <span className="text-[11px] font-bold text-[#5c403f] uppercase">{t.operator}</span>
          <span className="text-sm font-bold text-[#406182] mt-1">SBS Transit ({route.operator})</span>
        </div>
      </div>

      {/* Direction Toggles */}
      <div className="flex items-center gap-2 bg-[#f0edec] p-1.5 rounded-xl self-start">
        <button
          onClick={() => setDirection(1)}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            direction === 1 ? 'bg-[#c8102e] text-white shadow-xs' : 'text-[#5c403f] hover:text-[#1c1b1b]'
          }`}
        >
          {route.direction1Name}
        </button>
        <button
          onClick={() => setDirection(2)}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            direction === 2 ? 'bg-[#c8102e] text-white shadow-xs' : 'text-[#5c403f] hover:text-[#1c1b1b]'
          }`}
        >
          {route.direction2Name}
        </button>
      </div>

      {/* Sequential Route Stops Timeline */}
      <div className="bg-white rounded-xl p-5 md:p-6 border border-[#e2e8f0] shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#e2e8f0]">
          <span className="text-xs font-bold text-[#5c403f] uppercase tracking-wider">
            {t.stopsCount(stops.length)}
          </span>
          <span className="text-xs text-[#0E8345] font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#0E8345] animate-ping"></span>
            Live GPS telemetry active
          </span>
        </div>

        <div className="relative pl-6 flex flex-col gap-6">
          {/* Vertical connecting line */}
          <div className="absolute left-[33px] top-4 bottom-4 w-1 bg-[#e2e8f0]"></div>

          {stops.map((stop, index) => {
            const isSomerset = stop.code === '09038';
            return (
              <div key={stop.code} className="relative flex items-start gap-4">
                {/* Node icon */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black z-10 shadow-xs flex-shrink-0 transition-transform ${
                    isSomerset
                      ? 'bg-[#c8102e] text-white ring-4 ring-[#c8102e]/20 scale-110'
                      : index === 0 || index === stops.length - 1
                      ? 'bg-[#406182] text-white'
                      : 'bg-white border-2 border-[#406182] text-[#406182]'
                  }`}
                >
                  {index + 1}
                </div>

                {/* Stop Card */}
                <div
                  className={`flex-1 p-3.5 rounded-xl border transition-all ${
                    isSomerset
                      ? 'bg-[#c8102e]/5 border-[#c8102e]'
                      : 'bg-[#fcf9f8] border-[#e2e8f0] hover:bg-[#f6f3f2]'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm md:text-base text-[#1c1b1b]">
                        {stop.name}
                      </span>
                      <span className="text-xs font-bold text-[#5c403f] bg-[#ebe7e7] px-1.5 py-0.5 rounded border border-[#e2e8f0]">
                        {stop.code}
                      </span>
                      {isSomerset && (
                        <span className="text-[11px] font-bold text-[#c8102e] bg-[#c8102e]/10 px-2 py-0.5 rounded">
                          Your Selected Stop
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-[#5c403f] tabular-nums font-semibold">
                      {stop.distanceKm.toFixed(1)} km
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-[#5c403f]">
                    <span>{stop.road}</span>
                    {stop.mrtTransfer && (
                      <span className="inline-flex items-center gap-1 font-bold text-[#406182] bg-[#cfe5ff]/60 px-2 py-0.5 rounded border border-[#b6d8fe]">
                        <span className="material-symbols-outlined text-[13px]">
                          directions_subway
                        </span>
                        <span>
                          {t.transferMRT} {stop.mrtTransfer}
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
