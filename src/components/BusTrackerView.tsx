import React, { useState, useEffect, useCallback } from 'react';
import { BUS_SERVICES_AT_SOMERSET, BUS_ROUTES } from '../data/transitData';
import { LiveFleetRadar } from './LiveFleetRadar';
import { WalkingDirectionsModal } from './WalkingDirectionsModal';
import { AlertSettingsModal } from './AlertSettingsModal';
import { useToast } from './Toast';
import { fetchLtaBusArrivals } from '../services/ltaService';
import { BusServiceArrivals } from '../types';

interface BusTrackerViewProps {
  selectedBus: string;
  setSelectedBus: (bus: string) => void;
  lang: 'EN' | 'ZH';
}

export const BusTrackerView: React.FC<BusTrackerViewProps> = ({
  selectedBus,
  setSelectedBus,
  lang,
}) => {
  const { showToast } = useToast();
  const [direction, setDirection] = useState<1 | 2>(1);
  const [secondsAgo, setSecondsAgo] = useState(3);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [walkingModalOpen, setWalkingModalOpen] = useState(false);
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [searchVal, setSearchVal] = useState(selectedBus);
  const [servicesMap, setServicesMap] = useState<Record<string, BusServiceArrivals>>(BUS_SERVICES_AT_SOMERSET);
  const [isLtaLive, setIsLtaLive] = useState(false);

  // Sync search input with selectedBus
  useEffect(() => {
    setSearchVal(selectedBus);
  }, [selectedBus]);

  // Load LTA data
  const loadData = useCallback(async () => {
    try {
      const result = await fetchLtaBusArrivals('09038', selectedBus);
      setServicesMap((prev) => ({ ...prev, ...result.services }));
      setIsLtaLive(result.isLiveData);
      setSecondsAgo(0);
    } catch {
      // Fallback already handled
    }
  }, [selectedBus]);

  useEffect(() => {
    loadData();
    // 20-second LTA v3 refresh cycle
    const refreshTimer = setInterval(() => {
      loadData();
    }, 20000);
    return () => clearInterval(refreshTimer);
  }, [loadData]);

  // Telemetry refresh counter
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsAgo((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
    setTimeout(() => {
      setIsRefreshing(false);
      showToast(
        lang === 'EN' ? 'Refreshed live telemetry feed' : '已更新实时车队与到站数据',
        'info'
      );
    }, 400);
  };

  const handleToggleBookmark = () => {
    const nextState = !bookmarked;
    setBookmarked(nextState);
    if (nextState) {
      showToast(
        lang === 'EN'
          ? `Service ${selectedBus} saved to your bookmarks`
          : `已收藏 ${selectedBus}路 巴士`,
        'success'
      );
    } else {
      showToast(
        lang === 'EN'
          ? `Service ${selectedBus} removed from bookmarks`
          : `已取消收藏 ${selectedBus}路`,
        'info'
      );
    }
  };

  const handleShareEta = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
    showToast(
      lang === 'EN'
        ? `ETA link for Bus ${selectedBus} copied to clipboard!`
        : `已复制 ${selectedBus}路 实时到站链接！`,
      'success'
    );
  };

  const currentService =
    servicesMap[selectedBus] || BUS_SERVICES_AT_SOMERSET[selectedBus] || BUS_SERVICES_AT_SOMERSET['65'];
  const routeInfo = BUS_ROUTES[selectedBus] || BUS_ROUTES['65'];

  const quickPicks = ['14', '65', '123', '174', '190'];

  const otherServices = ['14', '123', '174', '143'].filter((s) => s !== selectedBus);

  const t = {
    EN: {
      detectedStop: 'Detected Stop: Opp Somerset Stn (09038)',
      detectedDistance: '120m away (2 min walk via Somerset Rd)',
      refreshed: (s: number) => `Live feed refreshed ${s}s ago`,
      refreshBtn: 'Refresh',
      quickPicks: 'Quick Picks:',
      trunk: 'TRUNK',
      towardsPrefix: 'Towards',
      viaPrefix: 'via',
      nextBus: 'NEXT BUS',
      secondBus: '2ND BUS',
      thirdBus: '3RD BUS',
      seatsAvail: 'Seats Avail',
      standing: 'Standing',
      fullLimited: 'Full / Limited',
      seats: 'Seats',
      telemetryLabel: 'Live Vehicle Telemetry:',
      oneStopAway: '1 Stop Away',
      approaching: 'Approaching Opp Somerset',
      midpoint: 'Midpoint Orchard',
      nationalYouth: 'National Youth Ctr',
      otherServices: 'Other Services at This Stop',
      additionalRoutes: `${otherServices.length} additional routes`,
      wheelchairBannerTitle: 'All SBS Buses 100% Wheelchair Accessible',
      wheelchairBannerSub:
        'Look for the blue wheelchair emblem on approaching vehicles for low-floor boarding ramps.',
      corridorStatusTitle: 'Transit Corridor Status',
      corridorDataSource: 'LTA DataMall Feed',
      normalServiceTitle: 'Normal Service on All Downtown Corridors',
      normalServiceDesc:
        'No route diversions or major choke points reported between Dhoby Ghaut and Orchard Boulevard. Buses maintaining expected 4 to 8-minute headways.',
      walkingDirections: 'Walking Directions',
      shareEta: 'Share ETA Link',
    },
    ZH: {
      detectedStop: '已定位车站：索美塞地铁站对面 (09038)',
      detectedDistance: '距离120米 (经索美塞路步行约2分钟)',
      refreshed: (s: number) => `实时数据 ${s}秒 前更新`,
      refreshBtn: '刷新',
      quickPicks: '快捷选择:',
      trunk: '干线',
      towardsPrefix: '开往',
      viaPrefix: '途经',
      nextBus: '下班车',
      secondBus: '第二班',
      thirdBus: '第三班',
      seatsAvail: '座位充足',
      standing: '允许站立',
      fullLimited: '满载 / 拥挤',
      seats: '有座',
      telemetryLabel: '实时车辆监控:',
      oneStopAway: '相距 1 站',
      approaching: '即将到达 索美塞站',
      midpoint: '中点乌节',
      nationalYouth: '国家青年中心',
      otherServices: '本站其他巴士服务',
      additionalRoutes: `共 ${otherServices.length} 条其他路线`,
      wheelchairBannerTitle: '所有新捷运巴士支持无障碍轮椅通行',
      wheelchairBannerSub: '请留意驶近车辆上的蓝色轮椅标识，提供低地板上车斜坡。',
      corridorStatusTitle: '干线走廊运营状况',
      corridorDataSource: '陆路交通管理局 DataMall 数据流',
      normalServiceTitle: '所有市区公共交通走廊运行正常',
      normalServiceDesc:
        '多美歌与乌节林荫道之间未报告改道或拥堵，巴士保持预期的4至8分钟发车间隔。',
      walkingDirections: '步行路线指引',
      shareEta: '分享到站链接',
    },
  }[lang];

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Top Telemetry & Search Action Ribbon */}
      <section className="w-full bg-[#f4f6f9] px-4 md:px-8 py-5 border-b border-[#e2e8f0]">
        <div className="max-w-7xl mx-auto flex flex-col gap-4">
          {/* Upper Context Row: GPS Location & Live Health Status */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 bg-white px-3.5 py-1.5 rounded-xl shadow-xs border border-[#e2e8f0]">
              <span className="material-symbols-outlined text-[#9e001f] text-[20px]">
                near_me
              </span>
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                <span className="text-xs sm:text-sm font-bold text-[#1c1b1b]">
                  {t.detectedStop}
                </span>
                <span className="hidden sm:inline text-[#5c403f]">•</span>
                <span className="text-xs text-[#5c403f]">{t.detectedDistance}</span>
              </div>
              <span className="relative flex h-2 w-2 ml-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0E8345] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0E8345]"></span>
              </span>
            </div>

            <div className="flex items-center gap-2 bg-[#f0edec] px-3.5 py-1.5 rounded-full border border-[#e2e8f0]">
              <span
                className={`material-symbols-outlined text-[16px] text-[#406182] ${
                  isRefreshing ? 'animate-spin' : ''
                }`}
              >
                sync
              </span>
              <span className="text-xs font-semibold text-[#1c1b1b]">
                {t.refreshed(secondsAgo)}
              </span>
              <button
                onClick={handleManualRefresh}
                className="ml-1 text-xs font-bold text-[#9e001f] hover:underline"
              >
                {t.refreshBtn}
              </button>
            </div>
          </div>

          {/* Main Search Card (High-Glanceability) */}
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-xs border border-[#e2e8f0]">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-[#9e001f] text-[24px]">
                    directions_bus
                  </span>
                </div>
                <input
                  type="text"
                  value={searchVal}
                  onChange={(e) => {
                    setSearchVal(e.target.value);
                    const clean = e.target.value.trim();
                    if (BUS_SERVICES_AT_SOMERSET[clean]) {
                      setSelectedBus(clean);
                    }
                  }}
                  placeholder={
                    lang === 'EN'
                      ? 'Enter Bus Service (e.g. 14, 65, 123, 174, 190)'
                      : '输入巴士路线编号 (如 14, 65, 123, 174, 190)'
                  }
                  className="w-full pl-11 pr-10 py-3 bg-[#f6f3f2] rounded-lg text-[#1c1b1b] text-base md:text-lg font-bold focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#c8102e]/30 border border-transparent focus:border-[#c8102e] transition-all"
                />
                {searchVal && (
                  <button
                    onClick={() => {
                      setSearchVal('');
                    }}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#5c403f] hover:text-[#1c1b1b]"
                  >
                    <span className="material-symbols-outlined text-[20px]">cancel</span>
                  </button>
                )}
              </div>

              {/* Quick Service Picks */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
                <span className="text-xs font-bold text-[#5c403f] whitespace-nowrap mr-1">
                  {t.quickPicks}
                </span>
                {quickPicks.map((bus) => {
                  const isSelected = selectedBus === bus;
                  return (
                    <button
                      key={bus}
                      onClick={() => {
                        setSelectedBus(bus);
                        setSearchVal(bus);
                      }}
                      className={`px-3.5 py-2 rounded-lg font-bold text-sm transition-all ${
                        isSelected
                          ? 'bg-[#c8102e] text-white shadow-sm ring-1 ring-[#c8102e]'
                          : 'bg-[#f0edec] text-[#1c1b1b] hover:bg-[#ebe7e7]'
                      }`}
                    >
                      {bus}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Service Destination Info Banner */}
            <div className="mt-4 pt-3 border-t border-[#e2e8f0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#f6f3f2] px-4 py-2.5 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#9e001f] text-white text-xs font-black tracking-wide">
                  {t.trunk}
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#1c1b1b]">
                  Service {selectedBus}:{' '}
                  {direction === 1
                    ? `${routeInfo.origin} ⇄ ${routeInfo.destination}`
                    : `${routeInfo.destination} ⇄ ${routeInfo.origin}`}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setDirection(1)}
                  className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                    direction === 1
                      ? 'bg-[#406182] text-white shadow-xs'
                      : 'bg-white text-[#5c403f] hover:bg-[#ebe7e7] border border-[#e2e8f0]'
                  }`}
                >
                  {routeInfo.direction1Name}
                </button>
                <button
                  onClick={() => setDirection(2)}
                  className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                    direction === 2
                      ? 'bg-[#406182] text-white shadow-xs'
                      : 'bg-white text-[#5c403f] hover:bg-[#ebe7e7] border border-[#e2e8f0]'
                  }`}
                >
                  {routeInfo.direction2Name}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dual-Column Master Operations Layout */}
      <section className="w-full px-4 md:px-8 py-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ================= LEFT COLUMN: Arrivals & Route Tracker (7 Cols) ================= */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Primary Featured Arrival Card */}
            <div className="bg-white rounded-xl p-5 md:p-6 shadow-sm border border-[#e2e8f0] flex flex-col gap-5 relative overflow-hidden">
              {/* Stop ID & Header Strip */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-[#c8102e] flex items-center justify-center text-white text-2xl font-black shadow-sm">
                    {selectedBus}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg md:text-xl font-bold text-[#1c1b1b]">
                        Opp Somerset Stn
                      </span>
                      <span className="text-xs font-bold text-[#5c403f] bg-[#ebe7e7] px-2 py-0.5 rounded border border-[#e2e8f0]">
                        09038
                      </span>
                    </div>
                    <p className="text-xs md:text-sm text-[#5c403f]">
                      {t.towardsPrefix}{' '}
                      <strong className="text-[#1c1b1b]">
                        {direction === 1 ? routeInfo.destination : routeInfo.origin}
                      </strong>{' '}
                      {t.viaPrefix} {currentService.via}
                    </p>
                  </div>
                </div>

                {/* Stop Action Icons */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setAlertModalOpen(true)}
                    className="w-9 h-9 rounded-lg bg-[#f6f3f2] hover:bg-[#ebe7e7] text-[#1c1b1b] flex items-center justify-center transition-colors border border-[#e2e8f0]"
                    title="Set Arrival Alert"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      notifications_active
                    </span>
                  </button>
                  <button
                    onClick={handleToggleBookmark}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors border ${
                      bookmarked
                        ? 'bg-[#c8102e]/10 border-[#c8102e]/30 text-[#c8102e]'
                        : 'bg-[#f6f3f2] hover:bg-[#ebe7e7] border-[#e2e8f0] text-[#5c403f]'
                    }`}
                    title="Bookmark Service"
                  >
                    <span
                      className="material-symbols-outlined text-[20px]"
                      style={{ fontVariationSettings: bookmarked ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      star
                    </span>
                  </button>
                </div>
              </div>

              {/* The SBS Multi-ETA Triple Arrival Display */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-[#f6f3f2] p-3 rounded-xl border border-[#e2e8f0]">
                {/* 1st Bus Slot: Arriving (Pulsing Green) */}
                <div className="bg-white p-4 rounded-lg flex flex-col justify-between shadow-xs border border-[#e2e8f0] relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#5c403f] uppercase tracking-wider">
                      {t.nextBus}
                    </span>
                    <span
                      className="flex items-center gap-1 text-xs text-[#406182] font-bold"
                      title={currentService.nextBus.busType === 'DD' ? 'Double Decker' : 'Single Decker'}
                    >
                      <span className="material-symbols-outlined text-[16px]">directions_bus</span>
                      <span>{currentService.nextBus.busType}</span>
                    </span>
                  </div>

                  <div className="my-2.5 flex items-baseline gap-1.5">
                    <span className="text-3xl md:text-4xl font-black text-[#0E8345] tracking-tight animate-pulse tabular-nums">
                      {currentService.nextBus.etaMinutes === 'ARR'
                        ? 'ARR'
                        : `${currentService.nextBus.etaMinutes}`}
                    </span>
                    <span className="text-xs font-bold text-[#0E8345]">
                      {currentService.nextBus.etaMinutes === 'ARR' ? '(< 1 min)' : 'mins'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#0E8345]/10 text-[#0E8345] border border-[#0E8345]/20">
                      <span className="material-symbols-outlined text-[13px]">
                        airline_seat_recline_normal
                      </span>
                      <span>{t.seatsAvail}</span>
                    </span>
                    <span
                      className="material-symbols-outlined text-[18px] text-[#406182]"
                      title="Wheelchair Accessible"
                    >
                      accessible
                    </span>
                  </div>
                </div>

                {/* 2nd Bus Slot: Standing Available */}
                <div className="bg-white p-4 rounded-lg flex flex-col justify-between shadow-xs border border-[#e2e8f0]">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#5c403f] uppercase tracking-wider">
                      {t.secondBus}
                    </span>
                    <span
                      className="flex items-center gap-1 text-xs text-[#406182] font-bold"
                      title={currentService.secondBus.busType === 'DD' ? 'Double Decker' : 'Single Decker'}
                    >
                      <span className="material-symbols-outlined text-[16px]">airport_shuttle</span>
                      <span>{currentService.secondBus.busType}</span>
                    </span>
                  </div>

                  <div className="my-2.5 flex items-baseline gap-1.5">
                    <span className="text-3xl md:text-4xl font-extrabold text-[#1c1b1b] tracking-tight tabular-nums">
                      {currentService.secondBus.etaMinutes}
                    </span>
                    <span className="text-sm font-bold text-[#5c403f]">mins</span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#D97706]/10 text-[#D97706] border border-[#D97706]/20">
                      <span className="material-symbols-outlined text-[13px]">groups</span>
                      <span>{t.standing}</span>
                    </span>
                    <span
                      className="material-symbols-outlined text-[18px] text-[#406182]"
                      title="Wheelchair Accessible"
                    >
                      accessible
                    </span>
                  </div>
                </div>

                {/* 3rd Bus Slot: Limited Standing */}
                <div className="bg-white p-4 rounded-lg flex flex-col justify-between shadow-xs border border-[#e2e8f0]">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#5c403f] uppercase tracking-wider">
                      {t.thirdBus}
                    </span>
                    <span
                      className="flex items-center gap-1 text-xs text-[#406182] font-bold"
                      title={currentService.thirdBus.busType === 'DD' ? 'Double Decker' : 'Single Decker'}
                    >
                      <span className="material-symbols-outlined text-[16px]">airport_shuttle</span>
                      <span>{currentService.thirdBus.busType}</span>
                    </span>
                  </div>

                  <div className="my-2.5 flex items-baseline gap-1.5">
                    <span className="text-3xl md:text-4xl font-extrabold text-[#1c1b1b] tracking-tight tabular-nums">
                      {currentService.thirdBus.etaMinutes}
                    </span>
                    <span className="text-sm font-bold text-[#5c403f]">mins</span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#C8102E]/10 text-[#C8102E] border border-[#C8102E]/20">
                      <span className="material-symbols-outlined text-[13px]">warning</span>
                      <span>{t.fullLimited}</span>
                    </span>
                    <span
                      className="material-symbols-outlined text-[18px] text-[#406182]"
                      title="Wheelchair Accessible"
                    >
                      accessible
                    </span>
                  </div>
                </div>
              </div>

              {/* Micro-Progress Line: Where Bus is right now */}
              <div className="flex flex-col gap-1.5 pt-1">
                <div className="flex items-center justify-between text-xs text-[#5c403f]">
                  <span>
                    {t.telemetryLabel}{' '}
                    <strong className="text-[#1c1b1b]">
                      {currentService.vehicleNo} ({currentService.currentSpeed} km/h)
                    </strong>
                  </span>
                  <span className="text-[#0E8345] font-bold">{t.oneStopAway}</span>
                </div>

                {/* Graphic Step Timeline */}
                <div className="relative py-2.5">
                  <div className="h-2 bg-[#ebe7e7] rounded-full w-full relative">
                    {/* Highlighted Track */}
                    <div className="h-2 bg-[#c8102e] rounded-full" style={{ width: '72%' }}></div>
                    {/* Bus Location Pulse Point */}
                    <div
                      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center justify-center transition-all duration-700"
                      style={{ left: '72%' }}
                    >
                      <div className="w-6 h-6 rounded-full bg-[#c8102e] text-white flex items-center justify-center shadow-md animate-bounce">
                        <span className="material-symbols-outlined text-[14px]">directions_bus</span>
                      </div>
                    </div>
                  </div>

                  {/* Stop Node Names */}
                  <div className="flex justify-between items-center mt-2.5 text-[11px] text-[#5c403f] font-semibold">
                    <span className="truncate max-w-[100px]">{t.midpoint}</span>
                    <span className="truncate max-w-[130px] text-center font-bold text-[#c8102e]">
                      {t.approaching}
                    </span>
                    <span className="truncate max-w-[110px] text-right">{t.nationalYouth}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Secondary Arrivals Section: Other Services at Stop 09038 */}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-base md:text-lg font-bold text-[#1c1b1b]">{t.otherServices}</h2>
                <span className="text-xs text-[#5c403f] font-medium">{t.additionalRoutes}</span>
              </div>

              {otherServices.map((srvNum) => {
                const srv = servicesMap[srvNum] || BUS_SERVICES_AT_SOMERSET[srvNum];
                if (!srv) return null;
                const nextEta = srv.nextBus.etaMinutes;
                const secondEta = srv.secondBus.etaMinutes;

                return (
                  <div
                    key={srvNum}
                    onClick={() => setSelectedBus(srvNum)}
                    className="bg-white p-3.5 md:p-4 rounded-xl shadow-xs hover:shadow-md border border-[#e2e8f0] transition-all flex items-center justify-between gap-3 cursor-pointer group"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-[#ebe7e7] group-hover:bg-[#c8102e] group-hover:text-white transition-colors flex items-center justify-center text-base font-black text-[#1c1b1b] shadow-xs">
                        {srvNum}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-[#1c1b1b] truncate group-hover:text-[#c8102e] transition-colors">
                          To {srv.destination}
                        </div>
                        <div className="text-xs text-[#5c403f] truncate">via {srv.via}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="flex flex-col items-end">
                        <div className="flex items-baseline gap-1">
                          <span
                            className={`text-xl font-black tabular-nums ${
                              nextEta === 'ARR' ? 'text-[#0E8345] animate-pulse' : 'text-[#1c1b1b]'
                            }`}
                          >
                            {nextEta}
                          </span>
                          <span
                            className={`text-xs font-semibold ${
                              nextEta === 'ARR' ? 'text-[#0E8345]' : 'text-[#5c403f]'
                            }`}
                          >
                            {nextEta === 'ARR' ? 'now' : 'min'}
                          </span>
                        </div>
                        <span
                          className={`inline-flex items-center gap-0.5 text-[10px] font-bold ${
                            srv.nextBus.occupancy === 'Seats'
                              ? 'text-[#0E8345]'
                              : srv.nextBus.occupancy === 'Standing'
                              ? 'text-[#D97706]'
                              : 'text-[#C8102E]'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[12px]">
                            {srv.nextBus.occupancy === 'Seats'
                              ? 'airline_seat_recline_normal'
                              : 'groups'}
                          </span>
                          <span>
                            {srv.nextBus.occupancy === 'Seats' ? t.seats : t.standing}
                          </span>
                        </span>
                      </div>

                      <div className="hidden sm:flex flex-col items-end bg-[#f6f3f2] px-2 py-1 rounded border border-[#e2e8f0]">
                        <div className="flex items-baseline gap-1">
                          <span className="text-xs font-bold text-[#1c1b1b] tabular-nums">
                            {secondEta}
                          </span>
                          <span className="text-[10px] text-[#5c403f]">min</span>
                        </div>
                        <span className="text-[10px] text-[#0E8345] font-bold">{t.seats}</span>
                      </div>

                      <button className="w-8 h-8 rounded-lg bg-[#f0edec] group-hover:bg-[#c8102e] group-hover:text-white flex items-center justify-center text-[#5c403f] transition-colors">
                        <span className="material-symbols-outlined text-[18px]">
                          chevron_right
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Daily Transit Info Callout */}
            <div className="bg-[#cfe5ff] text-[#001d34] p-4 rounded-xl flex items-center gap-3.5 border border-[#b6d8fe]">
              <span className="material-symbols-outlined text-[30px] text-[#406182] flex-shrink-0">
                info
              </span>
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-bold">
                  {t.wheelchairBannerTitle}
                </span>
                <span className="text-xs text-[#274969] mt-0.5">
                  {t.wheelchairBannerSub}
                </span>
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: Interactive Live Radar & Map (5 Cols) ================= */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Live Fleet Radar */}
            <LiveFleetRadar
              busNumber={selectedBus}
              speedKmh={currentService.currentSpeed}
              vehiclePlate={currentService.vehicleNo}
              lang={lang}
            />

            {/* Official Service Disruptions & Corridor Health Card */}
            <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-[#e2e8f0] flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#0E8345] text-[20px]">
                    verified
                  </span>
                  <span className="text-base font-bold text-[#1c1b1b]">
                    {t.corridorStatusTitle}
                  </span>
                </div>
                <span className="text-xs text-[#5c403f] font-semibold flex items-center gap-1">
                  {isLtaLive && <span className="w-1.5 h-1.5 rounded-full bg-[#0E8345] animate-ping"></span>}
                  {isLtaLive ? 'LTA DataMall v3 Live' : t.corridorDataSource}
                </span>
              </div>

              <div className="bg-[#f6f3f2] p-3.5 rounded-lg flex items-start gap-3 border border-[#e2e8f0]">
                <span className="material-symbols-outlined text-[#0E8345] text-[20px] flex-shrink-0 mt-0.5">
                  check_circle
                </span>
                <div className="flex flex-col">
                  <span className="text-xs sm:text-sm font-bold text-[#1c1b1b]">
                    {t.normalServiceTitle}
                  </span>
                  <p className="text-xs text-[#5c403f] mt-1 leading-relaxed">
                    {t.normalServiceDesc}
                  </p>
                </div>
              </div>

              {/* Quick Actions Panel */}
              <div className="grid grid-cols-2 gap-2 mt-1">
                <button
                  onClick={() => setWalkingModalOpen(true)}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-[#f0edec] hover:bg-[#ebe7e7] text-[#1c1b1b] border border-[#e2e8f0] text-xs font-bold transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[17px]">near_me</span>
                  <span>{t.walkingDirections}</span>
                </button>
                <button
                  onClick={handleShareEta}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-[#f0edec] hover:bg-[#ebe7e7] text-[#1c1b1b] border border-[#e2e8f0] text-xs font-bold transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[17px]">share</span>
                  <span>{t.shareEta}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
      <WalkingDirectionsModal
        isOpen={walkingModalOpen}
        onClose={() => setWalkingModalOpen(false)}
        lang={lang}
      />
      <AlertSettingsModal
        isOpen={alertModalOpen}
        onClose={() => setAlertModalOpen(false)}
        busNumber={selectedBus}
        lang={lang}
      />
    </div>
  );
};
