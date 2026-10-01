import React, { useState } from 'react';
import { useToast } from './Toast';

interface AlertSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  busNumber: string;
  lang: 'EN' | 'ZH';
}

export const AlertSettingsModal: React.FC<AlertSettingsModalProps> = ({
  isOpen,
  onClose,
  busNumber,
  lang,
}) => {
  const { showToast } = useToast();
  const [triggerCondition, setTriggerCondition] = useState<'arr' | '3min' | '5min'>('3min');
  const [soundEnabled, setSoundEnabled] = useState(true);

  if (!isOpen) return null;

  const t = {
    EN: {
      title: `Arrival Alert: Bus ${busNumber}`,
      subtitle: 'Receive real-time push notification when vehicle approaches',
      timingHeading: 'Notify me when vehicle is:',
      arrLabel: 'Arriving / 1 Stop Away (< 1 min)',
      threeMinLabel: '3 minutes before arrival (Recommended)',
      fiveMinLabel: '5 minutes before arrival',
      soundLabel: 'Play audio chime when triggered',
      saveBtn: 'Set Active Alert',
      cancelBtn: 'Cancel',
      savedToast: (bus: string) => `Alert active: will notify you 3 min before Bus ${bus} arrives!`,
    },
    ZH: {
      title: `到站提醒设置：${busNumber}路`,
      subtitle: '车辆临近时接收实时提示',
      timingHeading: '提醒触发时机：',
      arrLabel: '车辆即将进站 / 仅剩1站 (< 1分钟)',
      threeMinLabel: '进站前 3 分钟 (推荐)',
      fiveMinLabel: '进站前 5 分钟',
      soundLabel: '触发时播放提示音效',
      saveBtn: '开启到站提醒',
      cancelBtn: '取消',
      savedToast: (bus: string) => `已启用提醒：将在 ${bus}路 到站前3分钟通知您！`,
    },
  }[lang];

  const handleSave = () => {
    // Attempt standard browser notification permission if available
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    showToast(t.savedToast(busNumber), 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-xl shadow-2xl border border-[#e2e8f0] w-full max-w-md overflow-hidden animate-in zoom-in-95">
        <div className="bg-[#f0edec] p-4 border-b border-[#e2e8f0] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#9e001f] text-[24px]">
              notifications_active
            </span>
            <div>
              <h3 className="font-bold text-[#1c1b1b] text-base">{t.title}</h3>
              <p className="text-xs text-[#5c403f]">{t.subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-[#ebe7e7] flex items-center justify-center text-[#5c403f]"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="p-4 flex flex-col gap-4">
          <div>
            <label className="text-xs font-bold text-[#1c1b1b] block mb-2">
              {t.timingHeading}
            </label>
            <div className="flex flex-col gap-2">
              <label
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                  triggerCondition === 'arr'
                    ? 'border-[#c8102e] bg-[#c8102e]/5'
                    : 'border-[#e2e8f0] hover:bg-[#f6f3f2]'
                }`}
              >
                <input
                  type="radio"
                  name="alert-timing"
                  checked={triggerCondition === 'arr'}
                  onChange={() => setTriggerCondition('arr')}
                  className="accent-[#c8102e]"
                />
                <span className="text-xs font-semibold text-[#1c1b1b]">{t.arrLabel}</span>
              </label>

              <label
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                  triggerCondition === '3min'
                    ? 'border-[#c8102e] bg-[#c8102e]/5'
                    : 'border-[#e2e8f0] hover:bg-[#f6f3f2]'
                }`}
              >
                <input
                  type="radio"
                  name="alert-timing"
                  checked={triggerCondition === '3min'}
                  onChange={() => setTriggerCondition('3min')}
                  className="accent-[#c8102e]"
                />
                <span className="text-xs font-semibold text-[#1c1b1b]">{t.threeMinLabel}</span>
              </label>

              <label
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                  triggerCondition === '5min'
                    ? 'border-[#c8102e] bg-[#c8102e]/5'
                    : 'border-[#e2e8f0] hover:bg-[#f6f3f2]'
                }`}
              >
                <input
                  type="radio"
                  name="alert-timing"
                  checked={triggerCondition === '5min'}
                  onChange={() => setTriggerCondition('5min')}
                  className="accent-[#c8102e]"
                />
                <span className="text-xs font-semibold text-[#1c1b1b]">{t.fiveMinLabel}</span>
              </label>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer pt-2 border-t border-[#e2e8f0]">
            <input
              type="checkbox"
              checked={soundEnabled}
              onChange={(e) => setSoundEnabled(e.target.checked)}
              className="accent-[#c8102e] w-4 h-4 rounded"
            />
            <span className="text-xs font-semibold text-[#1c1b1b]">{t.soundLabel}</span>
          </label>
        </div>

        <div className="p-4 bg-[#f6f3f2] border-t border-[#e2e8f0] flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-[#ebe7e7] text-[#1c1b1b] border border-[#e2e8f0] rounded-lg text-xs font-bold transition-colors"
          >
            {t.cancelBtn}
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[#c8102e] hover:bg-[#9e001f] text-white rounded-lg text-xs font-bold shadow-sm transition-colors"
          >
            {t.saveBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
