import React from 'react';
import { NEARBY_STOPS, BUS_SERVICES_AT_SOMERSET } from '../data/transitData';
import { useToast } from './Toast';

interface SavedStopsViewProps {
  onSelectBus: (bus: string) => void;
  onNavigateToTracker: () => void;
  lang: 'EN' | 'ZH';
}

export const SavedStopsView: React.FC<SavedStopsViewProps> = ({
  onSelectBus,
  onNavigateToTracker,
  lang,
}) => {
  const { showToast } = useToast();

  const savedStops = NEARBY_STOPS.slice(0, 3); // 3 saved stops

  const t = {
    EN: {
      heading: 'My Saved Transit Hubs & Bus Stops',
      subheading: 'Instant glance multi-ETA monitoring for your frequent commutes',
      addStopBtn: '+ Add Stop to Bookmarks',
      servicesAtStop: 'Passing Services:',
      trackNow: 'Track Live on Map',
      removeToast: (name: string) => `Removed ${name} from saved stops`,
    },
    ZH: {
      heading: '我的收藏车站与枢纽',
      subheading: '常用通勤站点多班次实时到站概览',
      addStopBtn: '+ 添加收藏车站',
      servicesAtStop: '经停线路:',
      trackNow: '在地图中追踪',
      removeToast: (name: string) => `已将 ${name} 移出收藏`,
    },
  }[lang];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-6 flex flex-col gap-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-5 md:p-6 border border-[#e2e8f0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#9e001f] uppercase tracking-wider">
            <span className="material-symbols-outlined text-[16px]">bookmark</span>
            <span>Saved Stops</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-[#1c1b1b] mt-1">{t.heading}</h1>
          <p className="text-xs text-[#5c403f] mt-0.5">{t.subheading}</p>
        </div>

        <button
          onClick={() => {
            showToast(
              lang === 'EN'
                ? 'Use the search bar (Ctrl+K) to find and pin any Singapore bus stop'
                : '可通过搜索栏 (Ctrl+K) 查找并添加新加坡任意车站',
              'info'
            );
          }}
          className="self-start sm:self-auto px-4 py-2 bg-[#f0edec] hover:bg-[#ebe7e7] text-[#1c1b1b] text-xs font-bold rounded-lg border border-[#e2e8f0] transition-colors"
        >
          {t.addStopBtn}
        </button>
      </div>

      {/* Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {savedStops.map((stop) => (
          <div
            key={stop.code}
            className="bg-white rounded-xl p-5 border border-[#e2e8f0] shadow-xs flex flex-col justify-between gap-4 hover:shadow-md transition-shadow"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-[#1c1b1b] flex items-center gap-1.5">
                    <span>{stop.name}</span>
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-xs font-bold text-[#5c403f] bg-[#ebe7e7] px-1.5 py-0.5 rounded border border-[#e2e8f0]">
                      {stop.code}
                    </span>
                    <span className="text-xs text-[#5c403f]">• {stop.roadName}</span>
                  </div>
                </div>

                <button
                  onClick={() => showToast(t.removeToast(stop.name), 'info')}
                  className="text-[#c8102e] hover:opacity-80"
                  title="Remove Bookmark"
                >
                  <span
                    className="material-symbols-outlined text-[20px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                </button>
              </div>

              {stop.mrtTransfer && (
                <div className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-bold text-[#406182] bg-[#cfe5ff]/60 px-2 py-0.5 rounded border border-[#b6d8fe]">
                  <span className="material-symbols-outlined text-[13px]">directions_subway</span>
                  <span>{stop.mrtTransfer}</span>
                </div>
              )}

              {/* Multi-Service ETAs inside this stop */}
              <div className="mt-4 pt-3 border-t border-[#e2e8f0] flex flex-col gap-2">
                <span className="text-[11px] font-bold text-[#5c403f] uppercase">
                  {t.servicesAtStop}
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {stop.services.slice(0, 3).map((srvNum) => {
                    const srv = BUS_SERVICES_AT_SOMERSET[srvNum];
                    const nextEta = srv ? srv.nextBus.etaMinutes : '4';
                    return (
                      <button
                        key={srvNum}
                        onClick={() => {
                          onSelectBus(srvNum);
                          onNavigateToTracker();
                        }}
                        className="flex flex-col items-center justify-center p-2 rounded-lg bg-[#f6f3f2] hover:bg-[#c8102e] hover:text-white transition-all text-center group border border-[#e2e8f0]"
                      >
                        <span className="text-xs font-black text-[#1c1b1b] group-hover:text-white">
                          {srvNum}
                        </span>
                        <span
                          className={`text-sm font-bold tabular-nums group-hover:text-white ${
                            nextEta === 'ARR' ? 'text-[#0E8345] animate-pulse' : 'text-[#1c1b1b]'
                          }`}
                        >
                          {nextEta === 'ARR' ? 'ARR' : `${nextEta}m`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                onSelectBus(stop.services[0] || '65');
                onNavigateToTracker();
              }}
              className="w-full py-2.5 rounded-lg bg-[#f0edec] hover:bg-[#c8102e] hover:text-white transition-all text-xs font-bold text-[#1c1b1b] flex items-center justify-center gap-1.5 border border-[#e2e8f0]"
            >
              <span className="material-symbols-outlined text-[16px]">near_me</span>
              <span>{t.trackNow}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
