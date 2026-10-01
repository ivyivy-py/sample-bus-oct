import React from 'react';

interface WalkingDirectionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'EN' | 'ZH';
}

export const WalkingDirectionsModal: React.FC<WalkingDirectionsModalProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  if (!isOpen) return null;

  const t = {
    EN: {
      title: 'Walking Directions to Stop 09038',
      subtitle: 'Opp Somerset Stn • 120 meters • 2 min walk',
      step1Title: 'Head East on Somerset Road',
      step1Desc: 'Start from 313@Somerset exit, proceed along Somerset Rd footpath for 60 meters.',
      step2Title: 'Cross Pedestrian Crossing',
      step2Desc: 'Signalized crossing near Midpoint Orchard / Somerset intersection (30 meters).',
      step3Title: 'Arrive at Opp Somerset Stn (09038)',
      step3Desc: 'Sheltered bus bay directly opposite 111 Somerset. Boarding berths clearly marked.',
      openMaps: 'Open in Google Maps',
      close: 'Done',
    },
    ZH: {
      title: '前往 09038 站步行导航',
      subtitle: '索美塞地铁站对面 • 120米 • 步行约2分钟',
      step1Title: '沿索美塞路向东行进',
      step1Desc: '自313@Somerset出口出发，沿索美塞路步道前行60米。',
      step2Title: '通过行人斑马线',
      step2Desc: '靠近中点乌节与索美塞交叉路口的信号灯斑马线（30米）。',
      step3Title: '到达索美塞地铁站对面板车站 (09038)',
      step3Desc: '位于111 Somerset对面的遮阳巴士站，乘车泊位清晰标明。',
      openMaps: '在地图中打开',
      close: '完成',
    },
  }[lang];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-xl shadow-2xl border border-[#e2e8f0] w-full max-w-md overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="bg-[#f0edec] p-4 border-b border-[#e2e8f0] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#9e001f] text-[24px]">
              directions_walk
            </span>
            <div>
              <h3 className="font-bold text-[#1c1b1b] text-base">{t.title}</h3>
              <p className="text-xs text-[#5c403f]">{t.subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-[#ebe7e7] flex items-center justify-center text-[#5c403f] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Steps List */}
        <div className="p-4 flex flex-col gap-4">
          <div className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className="w-7 h-7 rounded-full bg-[#c8102e] text-white flex items-center justify-center text-xs font-bold">
                1
              </div>
              <div className="w-0.5 h-10 bg-[#e2e8f0] my-1"></div>
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#1c1b1b]">{t.step1Title}</h4>
              <p className="text-xs text-[#5c403f] mt-0.5 leading-relaxed">{t.step1Desc}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className="w-7 h-7 rounded-full bg-[#406182] text-white flex items-center justify-center text-xs font-bold">
                2
              </div>
              <div className="w-0.5 h-10 bg-[#e2e8f0] my-1"></div>
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#1c1b1b]">{t.step2Title}</h4>
              <p className="text-xs text-[#5c403f] mt-0.5 leading-relaxed">{t.step2Desc}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className="w-7 h-7 rounded-full bg-[#0E8345] text-white flex items-center justify-center text-xs font-bold">
                3
              </div>
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#1c1b1b]">{t.step3Title}</h4>
              <p className="text-xs text-[#5c403f] mt-0.5 leading-relaxed">{t.step3Desc}</p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#f6f3f2] border-t border-[#e2e8f0] flex items-center justify-between">
          <a
            href="https://maps.google.com/?q=1.3006,103.8391"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-[#406182] hover:underline flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
            <span>{t.openMaps}</span>
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#c8102e] hover:bg-[#9e001f] text-white rounded-lg text-xs font-bold transition-colors"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
