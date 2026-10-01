import React from 'react';
import { SERVICE_ALERTS } from '../data/transitData';

interface ServiceAlertsViewProps {
  lang: 'EN' | 'ZH';
}

export const ServiceAlertsView: React.FC<ServiceAlertsViewProps> = ({ lang }) => {
  const mrtLines = [
    { code: 'NSL', name: 'North-South Line', color: '#D9381E', status: 'Normal (2 min headway)' },
    { code: 'EWL', name: 'East-West Line', color: '#009645', status: 'Normal (2.5 min headway)' },
    { code: 'CCL', name: 'Circle Line', color: '#FA9E0D', status: 'Normal (3 min headway)' },
    { code: 'DTL', name: 'Downtown Line', color: '#005EC4', status: 'Normal (3 min headway)' },
    { code: 'NEL', name: 'North East Line', color: '#8F1A95', status: 'Normal (3 min headway)' },
    { code: 'TEL', name: 'Thomson-East Coast Line', color: '#9D5B25', status: 'Normal (4 min headway)' },
  ];

  const t = {
    EN: {
      heading: 'Singapore Public Transport Service Advisories',
      subheading: 'Live telemetry updates from Land Transport Authority (LTA), SBS Transit & SMRT',
      mrtGridHeading: 'Rapid Transit System Network Status (MRT / LRT)',
      alertsHeading: 'Live Corridor Bulletins & Advisories',
      allNormal: 'All Lines Operating Under Regular Headway',
      weatherAdvisoryTitle: 'Tropical Weather Impact',
      weatherAdvisoryDesc:
        'Intermittent passing rain across Central Region. Drivers maintaining wet-weather safety headway buffers (+1-2 mins).',
    },
    ZH: {
      heading: '新加坡公共交通营运通告',
      subheading: '来自陆交局 (LTA)、新捷运及SMRT的实时网络监控',
      mrtGridHeading: '地铁与轻轨网络运行状态 (MRT / LRT)',
      alertsHeading: '走廊公告与临时调整',
      allNormal: '所有线路维持正常发车频次',
      weatherAdvisoryTitle: '热带降雨天气提示',
      weatherAdvisoryDesc: '新加坡中部区域有阵雨，司机遵循雨天行车安全缓冲，车距可能延长1-2分钟。',
    },
  }[lang];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-6 flex flex-col gap-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-5 md:p-6 border border-[#e2e8f0] shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold text-[#9e001f] uppercase tracking-wider">
          <span className="material-symbols-outlined text-[16px]">info</span>
          <span>Official Bulletins</span>
        </div>
        <h1 className="text-xl md:text-2xl font-bold text-[#1c1b1b] mt-1">{t.heading}</h1>
        <p className="text-xs text-[#5c403f] mt-0.5">{t.subheading}</p>
      </div>

      {/* MRT Lines Status Grid */}
      <div className="bg-white rounded-xl p-5 md:p-6 border border-[#e2e8f0] shadow-xs flex flex-col gap-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#e2e8f0]">
          <h2 className="text-base font-bold text-[#1c1b1b] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0E8345] text-[20px]">
              verified
            </span>
            <span>{t.mrtGridHeading}</span>
          </h2>
          <span className="text-xs text-[#0E8345] font-bold bg-[#0E8345]/10 px-2.5 py-0.5 rounded-full border border-[#0E8345]/20">
            {t.allNormal}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {mrtLines.map((line) => (
            <div
              key={line.code}
              className="p-3.5 rounded-xl border border-[#e2e8f0] bg-[#fcf9f8] flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg text-white font-bold flex items-center justify-center text-xs shadow-xs"
                  style={{ backgroundColor: line.color }}
                >
                  {line.code}
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1c1b1b]">{line.name}</div>
                  <div className="text-[11px] text-[#0E8345] font-semibold mt-0.5">
                    ● {line.status}
                  </div>
                </div>
              </div>
              <span className="material-symbols-outlined text-[#0E8345] text-[18px]">
                check_circle
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Weather Advisory Card */}
      <div className="bg-[#cfe5ff] text-[#001d34] p-4 md:p-5 rounded-xl border border-[#b6d8fe] flex items-start gap-3.5">
        <span className="material-symbols-outlined text-[28px] text-[#406182] flex-shrink-0 mt-0.5">
          rainy
        </span>
        <div>
          <h3 className="text-sm font-bold">{t.weatherAdvisoryTitle}</h3>
          <p className="text-xs text-[#274969] mt-0.5 leading-relaxed">
            {t.weatherAdvisoryDesc}
          </p>
        </div>
      </div>

      {/* Bulletins List */}
      <div className="flex flex-col gap-3">
        <h2 className="text-base font-bold text-[#1c1b1b] px-1">{t.alertsHeading}</h2>
        {SERVICE_ALERTS.map((alert) => (
          <div
            key={alert.id}
            className="bg-white rounded-xl p-4 md:p-5 border border-[#e2e8f0] shadow-xs flex items-start justify-between gap-4"
          >
            <div className="flex items-start gap-3.5">
              <span
                className={`material-symbols-outlined text-[22px] flex-shrink-0 mt-0.5 ${
                  alert.status === 'NORMAL' ? 'text-[#0E8345]' : 'text-[#D97706]'
                }`}
              >
                {alert.status === 'NORMAL' ? 'check_circle' : 'warning'}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#9e001f] bg-[#f0edec] px-2 py-0.5 rounded">
                    {alert.lineOrService}
                  </span>
                  <span className="text-xs text-[#5c403f]">{alert.updatedAt}</span>
                </div>
                <h3 className="text-sm md:text-base font-bold text-[#1c1b1b] mt-1">
                  {alert.title}
                </h3>
                <p className="text-xs text-[#5c403f] mt-1 leading-relaxed max-w-3xl">
                  {alert.detail}
                </p>
              </div>
            </div>

            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-full border whitespace-nowrap hidden sm:inline-block ${
                alert.status === 'NORMAL'
                  ? 'bg-[#0E8345]/10 text-[#0E8345] border-[#0E8345]/20'
                  : 'bg-[#D97706]/10 text-[#D97706] border-[#D97706]/20'
              }`}
            >
              {alert.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
