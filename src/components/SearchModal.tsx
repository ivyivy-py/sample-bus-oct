import React, { useState, useEffect, useRef } from 'react';
import { NEARBY_STOPS, BUS_SERVICES_AT_SOMERSET } from '../data/transitData';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectService: (serviceNo: string) => void;
  onSelectStop?: (stopCode: string) => void;
  lang: 'EN' | 'ZH';
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectService,
  lang,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const allServices = Object.values(BUS_SERVICES_AT_SOMERSET);

  const filteredServices = allServices.filter(
    (s) =>
      s.serviceNo.toLowerCase().includes(query.toLowerCase()) ||
      s.destination.toLowerCase().includes(query.toLowerCase()) ||
      s.via.toLowerCase().includes(query.toLowerCase())
  );

  const filteredStops = NEARBY_STOPS.filter(
    (stop) =>
      stop.code.includes(query) ||
      stop.name.toLowerCase().includes(query.toLowerCase()) ||
      stop.roadName.toLowerCase().includes(query.toLowerCase())
  );

  const t = {
    EN: {
      placeholder: 'Search bus service, stop code, or road name...',
      servicesHeader: 'Bus Services',
      stopsHeader: 'Bus Stops & Stations',
      noResults: 'No transport routes or stops found matching',
      esc: 'ESC to close',
    },
    ZH: {
      placeholder: '搜索巴士路线、车站编号或道路...',
      servicesHeader: '巴士服务',
      stopsHeader: '车站与地铁站',
      noResults: '未找到匹配的线路或车站',
      esc: 'ESC 退出',
    },
  }[lang];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/40 backdrop-blur-xs animate-in fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl shadow-2xl border border-[#e2e8f0] w-full max-w-xl overflow-hidden animate-in zoom-in-95 flex flex-col"
      >
        {/* Search Input Bar */}
        <div className="p-3.5 border-b border-[#e2e8f0] flex items-center gap-3 bg-[#fcf9f8]">
          <span className="material-symbols-outlined text-[#9e001f] text-[24px]">search</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.placeholder}
            className="w-full bg-transparent text-sm md:text-base font-semibold text-[#1c1b1b] focus:outline-none placeholder-[#5c403f]/60"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-[#5c403f] hover:text-[#1c1b1b]"
            >
              <span className="material-symbols-outlined text-[18px]">cancel</span>
            </button>
          )}
          <span className="text-[11px] font-bold text-[#5c403f] bg-[#ebe7e7] px-1.5 py-0.5 rounded border border-[#e2e8f0] whitespace-nowrap">
            {t.esc}
          </span>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-3 flex flex-col gap-4">
          {/* Services Section */}
          {filteredServices.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-[#5c403f] uppercase tracking-wider px-2 mb-1.5">
                {t.servicesHeader}
              </div>
              <div className="flex flex-col gap-1">
                {filteredServices.map((service) => (
                  <button
                    key={service.serviceNo}
                    onClick={() => {
                      onSelectService(service.serviceNo);
                      onClose();
                    }}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-[#f6f3f2] transition-colors text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#c8102e] text-white flex items-center justify-center font-bold text-base shadow-sm group-hover:scale-105 transition-transform">
                        {service.serviceNo}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-[#1c1b1b]">
                          To {service.destination}
                        </div>
                        <div className="text-xs text-[#5c403f]">via {service.via}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-[#0E8345] bg-[#0E8345]/10 px-2 py-0.5 rounded">
                        {service.nextBus.etaMinutes === 'ARR'
                          ? 'ARR'
                          : `${service.nextBus.etaMinutes} min`}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stops Section */}
          {filteredStops.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-[#5c403f] uppercase tracking-wider px-2 mb-1.5">
                {t.stopsHeader}
              </div>
              <div className="flex flex-col gap-1">
                {filteredStops.map((stop) => (
                  <button
                    key={stop.code}
                    onClick={() => {
                      // pick first service available at this stop
                      onSelectService(stop.services[0]);
                      onClose();
                    }}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-[#f6f3f2] transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#406182] text-white flex items-center justify-center">
                        <span className="material-symbols-outlined text-[18px]">
                          directions_bus
                        </span>
                      </div>
                      <div>
                        <div className="font-bold text-sm text-[#1c1b1b] flex items-center gap-1.5">
                          <span>{stop.name}</span>
                          <span className="text-[11px] bg-[#ebe7e7] text-[#5c403f] px-1 rounded font-bold">
                            {stop.code}
                          </span>
                        </div>
                        <div className="text-xs text-[#5c403f]">
                          {stop.roadName} • {stop.distanceMeters}m away
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-[#406182] font-semibold">
                      {stop.services.slice(0, 3).join(', ')}...
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredServices.length === 0 && filteredStops.length === 0 && (
            <div className="py-8 text-center text-sm text-[#5c403f]">
              <span className="material-symbols-outlined text-[36px] text-[#5c403f]/40 mb-2">
                search_off
              </span>
              <p>
                {t.noResults} "{query}"
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
