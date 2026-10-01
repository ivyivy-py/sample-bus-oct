import React from 'react';
import { useToast } from './Toast';

interface FooterProps {
  lang: 'EN' | 'ZH';
}

export const Footer: React.FC<FooterProps> = ({ lang }) => {
  const { showToast } = useToast();

  const handleLinkClick = (e: React.MouseEvent, title: string) => {
    e.preventDefault();
    showToast(
      lang === 'EN'
        ? `${title}: Connected to Land Transport Authority DataMall v2.8 API`
        : `${title}：已连接至新加坡陆路交通管理局 DataMall v2.8 API`,
      'info'
    );
  };

  return (
    <footer className="w-full bg-[#f6f3f2] py-8 border-t border-[#e2e8f0] mt-auto">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#5c403f]">
        <div>
          <strong className="text-sm font-bold text-[#1c1b1b]">TransitPulse</strong> •{' '}
          {lang === 'EN'
            ? 'Civic Transit Telemetry Platform. Data synced with LTA DataMall v2.8.'
            : '民用公共交通遥测平台。实时数据同步自新加坡陆交局 DataMall v2.8。'}
        </div>
        <div className="flex items-center gap-6">
          <a
            href="#api"
            onClick={(e) => handleLinkClick(e, 'Civic API Feed')}
            className="hover:text-[#1c1b1b] transition-colors font-semibold"
          >
            {lang === 'EN' ? 'Civic API Feed' : '数据接口'}
          </a>
          <a
            href="#accessibility"
            onClick={(e) => handleLinkClick(e, 'Accessibility Standards')}
            className="hover:text-[#1c1b1b] transition-colors font-semibold"
          >
            {lang === 'EN' ? 'Accessibility Standards' : '无障碍标准'}
          </a>
          <a
            href="#status"
            onClick={(e) => handleLinkClick(e, 'System Status')}
            className="hover:text-[#1c1b1b] transition-colors font-semibold"
          >
            {lang === 'EN' ? 'System Status' : '系统状态'}
          </a>
        </div>
      </div>
    </footer>
  );
};
