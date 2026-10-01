import React, { useState } from 'react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSearch: () => void;
  lang: 'EN' | 'ZH';
  setLang: (lang: 'EN' | 'ZH') => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenSearch,
  lang,
  setLang,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const t = {
    EN: {
      statusText: 'All MRT Lines & Trunk Bus Routes operating normally',
      nslHeadway: 'North-South Line: 2 min headway',
      peakFreq: 'Peak Freq Active',
      area: 'Orchard Blvd / Somerset Area',
      searchPlaceholder: 'Search stop code, bus 65, 174, NSL...',
      busTracker: 'Bus Tracker',
      routeExplorer: 'Route Explorer',
      savedStops: 'Saved Stops',
      serviceAlerts: 'Service Alerts',
    },
    ZH: {
      statusText: '所有地铁线及干线巴士运营正常',
      nslHeadway: '南北线：2分钟发车间隔',
      peakFreq: '高峰频次运行中',
      area: '乌节林荫道 / 索美塞区域',
      searchPlaceholder: '搜索车站编号、65、174路或地铁线...',
      busTracker: '巴士追踪',
      routeExplorer: '路线探索',
      savedStops: '已存站点',
      serviceAlerts: '营运通告',
    },
  }[lang];

  const navItems = [
    { id: 'bus-tracker', label: t.busTracker },
    { id: 'route-explorer', label: t.routeExplorer },
    { id: 'saved-stops', label: t.savedStops },
    { id: 'service-alerts', label: t.serviceAlerts },
  ];

  return (
    <header className="fixed top-0 w-full z-40 bg-[#fcf9f8]/95 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      {/* Top Telemetry Strip */}
      <div className="w-full bg-[#ebe7e7] px-4 md:px-8 py-1 border-b border-[#e2e8f0]/60">
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0E8345] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0E8345]"></span>
            </span>
            <span className="text-[#1c1b1b]">{t.statusText}</span>
            <span className="hidden lg:inline text-[#5c403f]">• {t.nslHeadway}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden md:flex items-center gap-1 text-[#5c403f]">
              <span className="material-symbols-outlined text-[15px]">schedule</span>
              <span>{t.peakFreq}</span>
            </span>
            <button
              onClick={() => setLang(lang === 'EN' ? 'ZH' : 'EN')}
              className="flex items-center gap-1 bg-white px-2 py-0.5 rounded text-xs text-[#1c1b1b] border border-[#e2e8f0] hover:bg-[#f6f3f2] transition-colors"
              title="Toggle Language"
            >
              <span className="material-symbols-outlined text-[13px]">language</span>
              <span>{lang === 'EN' ? 'EN / 中文' : '中文 / EN'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Brand & Navigation Strip */}
      <div className="h-16 md:h-20 w-full px-4 md:px-8 max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveTab('bus-tracker')}
            className="flex items-center gap-2 text-left focus:outline-none"
          >
            <div className="w-9 h-9 rounded-lg bg-[#c8102e] flex items-center justify-center text-white text-lg font-black tracking-tight shadow-sm">
              TP
            </div>
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-bold text-[#1c1b1b] leading-tight tracking-tight">
                TransitPulse
              </span>
              <span className="text-[11px] text-[#9e001f] font-bold tracking-wider uppercase">
                Singapore Live
              </span>
            </div>
          </button>

          <div className="hidden xl:flex items-center gap-2 bg-[#f0edec] px-3 py-1 rounded-full border border-[#e2e8f0]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0E8345] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0E8345]"></span>
            </span>
            <span className="text-xs text-[#1c1b1b] font-semibold">{t.area}</span>
          </div>
        </div>

        {/* Global Search Bar (opens Ctrl+K search palette) */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-2">
          <button
            type="button"
            onClick={onOpenSearch}
            className="w-full flex items-center bg-[#f6f3f2] hover:bg-[#ffffff] hover:shadow-sm border border-transparent hover:border-[#e2e8f0] px-3 py-2 rounded-lg text-[#5c403f] transition-all cursor-pointer text-left"
          >
            <span className="material-symbols-outlined text-[19px] text-[#5c403f] mr-2">
              search
            </span>
            <span className="text-xs md:text-sm text-[#5c403f] flex-1 truncate">
              {t.searchPlaceholder}
            </span>
            <kbd className="hidden sm:inline-block bg-[#ebe7e7] text-[#1c1b1b] px-1.5 py-0.5 rounded text-[11px] font-bold border border-[#e2e8f0]">
              Ctrl K
            </kbd>
          </button>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-[#c8102e] text-white shadow-sm'
                    : 'text-[#5c403f] hover:text-[#1c1b1b] hover:bg-[#f0edec]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Actions & Mobile Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSearch}
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg bg-[#f0edec] text-[#1c1b1b]"
            title="Search"
          >
            <span className="material-symbols-outlined text-[20px]">search</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex lg:hidden items-center justify-center w-9 h-9 rounded-lg bg-[#f0edec] text-[#1c1b1b]"
            aria-label="Toggle navigation menu"
          >
            <span className="material-symbols-outlined text-[22px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>

          <div
            className="w-8 h-8 rounded-full bg-[#9e001f] flex items-center justify-center shadow-sm cursor-pointer hover:opacity-90"
            title="Civic Transit Profile"
          >
            <span className="material-symbols-outlined text-white text-[18px]">person</span>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden w-full bg-[#fcf9f8] border-b border-[#e2e8f0] px-4 py-3 flex flex-col gap-1 shadow-lg animate-in slide-in-from-top-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === item.id
                  ? 'bg-[#c8102e] text-white'
                  : 'text-[#1c1b1b] hover:bg-[#f0edec]'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 border-t border-[#e2e8f0] flex items-center justify-between text-xs text-[#5c403f]">
            <span>{t.area}</span>
            <span className="font-semibold text-[#0E8345]">{t.statusText}</span>
          </div>
        </div>
      )}
    </header>
  );
};
