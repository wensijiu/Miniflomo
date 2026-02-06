import { X, Bell, Clock, Calendar, Check } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ReminderConfig {
  enabled: boolean;
  time: 'morning' | 'afternoon' | 'evening';
  frequency: 'daily' | 'weekly' | 'custom';
  customDays?: number[]; // 0-6 (周日-周六)
  subscribed: boolean;
  subscribedAt?: number;
}

interface ReminderSettingsPageProps {
  onClose: () => void;
}

const TIME_OPTIONS = [
  { value: 'morning', label: '早晨', time: '09:00', icon: '🌅' },
  { value: 'afternoon', label: '下午', time: '15:00', icon: '☀️' },
  { value: 'evening', label: '晚上', time: '21:00', icon: '🌙' },
] as const;

const FREQUENCY_OPTIONS = [
  { value: 'daily', label: '每天', desc: '每天推送回顾提醒' },
  { value: 'weekly', label: '每周', desc: '每周日推送回顾' },
  { value: 'custom', label: '自定义', desc: '选择特定日期' },
] as const;

const WEEKDAYS = [
  { value: 0, label: '周日', short: '日' },
  { value: 1, label: '周一', short: '一' },
  { value: 2, label: '周二', short: '二' },
  { value: 3, label: '周三', short: '三' },
  { value: 4, label: '周四', short: '四' },
  { value: 5, label: '周五', short: '五' },
  { value: 6, label: '周六', short: '六' },
];

export function ReminderSettingsPage({ onClose }: ReminderSettingsPageProps) {
  const [config, setConfig] = useState<ReminderConfig>({
    enabled: false,
    time: 'morning',
    frequency: 'daily',
    customDays: [1, 2, 3, 4, 5], // 默认工作日
    subscribed: false,
  });

  // 加载配置
  useEffect(() => {
    const saved = localStorage.getItem('reminderConfig');
    if (saved) {
      setConfig(JSON.parse(saved));
    }
  }, []);

  // 保存配置
  const saveConfig = (newConfig: ReminderConfig) => {
    setConfig(newConfig);
    localStorage.setItem('reminderConfig', JSON.stringify(newConfig));
  };

  // 模拟微信订阅消息授权
  const handleSubscribe = () => {
    // 在真实微信小程序中，这里会调用：
    // wx.requestSubscribeMessage({
    //   tmplIds: ['订阅消息模板ID'],
    //   success: (res) => { ... }
    // })
    
    // 现在模拟授权成功
    const newConfig = {
      ...config,
      subscribed: true,
      subscribedAt: Date.now(),
    };
    saveConfig(newConfig);
    
    alert('✅ 订阅成功！\n\n在微信小程序中，这里会弹出微信官方的订阅授权弹窗。\n\n授权后，服务器会在设定的时间向你推送回顾提醒消息。');
  };

  // 切换提醒开关
  const toggleReminder = () => {
    if (!config.enabled && !config.subscribed) {
      // 如果是首次开启，先订阅
      handleSubscribe();
    }
    saveConfig({ ...config, enabled: !config.enabled });
  };

  // 切换自定义日期
  const toggleCustomDay = (day: number) => {
    const customDays = config.customDays || [];
    const newDays = customDays.includes(day)
      ? customDays.filter(d => d !== day)
      : [...customDays, day].sort();
    saveConfig({ ...config, customDays: newDays });
  };

  const selectedTime = TIME_OPTIONS.find(t => t.value === config.time)!;
  const selectedFrequency = FREQUENCY_OPTIONS.find(f => f.value === config.frequency)!;

  return (
    <div className="fixed inset-0 bg-background z-50">
      <div className="h-screen flex flex-col max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between h-14 px-4 border-b border-border bg-white relative pt-safe">
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-accent transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <h1 className="text-base absolute left-1/2 -translate-x-1/2">回顾提醒</h1>
          <div className="w-8" />
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* 开关卡片 */}
          <div className="bg-white rounded-2xl p-5 mb-4 border border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Bell className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-base font-medium">定时回顾提醒</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {config.enabled ? '已开启' : '已关闭'}
                  </p>
                </div>
              </div>
              <button
                onClick={toggleReminder}
                className={`relative w-12 h-7 rounded-full transition-colors ${
                  config.enabled ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <div
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                    config.enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {config.subscribed && (
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>已授权订阅消息</span>
                  <span className="ml-auto">
                    {new Date(config.subscribedAt!).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}
          </div>

          {config.enabled && (
            <>
              {/* 提醒时间 */}
              <div className="bg-white rounded-2xl p-5 mb-4 border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-primary" />
                  <h3 className="text-base font-medium">提醒时间</h3>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {TIME_OPTIONS.map(option => (
                    <button
                      key={option.value}
                      onClick={() => saveConfig({ ...config, time: option.value })}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        config.time === option.value
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/30'
                      }`}
                    >
                      <div className="text-2xl mb-2">{option.icon}</div>
                      <div className="text-sm font-medium mb-1">{option.label}</div>
                      <div className="text-xs text-muted-foreground">{option.time}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 提醒频率 */}
              <div className="bg-white rounded-2xl p-5 mb-4 border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5 text-primary" />
                  <h3 className="text-base font-medium">提醒频率</h3>
                </div>
                <div className="space-y-3">
                  {FREQUENCY_OPTIONS.map(option => (
                    <button
                      key={option.value}
                      onClick={() => saveConfig({ ...config, frequency: option.value })}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                        config.frequency === option.value
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium mb-1">{option.label}</div>
                          <div className="text-xs text-muted-foreground">{option.desc}</div>
                        </div>
                        {config.frequency === option.value && (
                          <Check className="w-5 h-5 text-primary" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 自定义日期选择 */}
              {config.frequency === 'custom' && (
                <div className="bg-white rounded-2xl p-5 mb-4 border border-border">
                  <h4 className="text-sm font-medium mb-3">选择提醒日期</h4>
                  <div className="grid grid-cols-7 gap-2">
                    {WEEKDAYS.map(day => (
                      <button
                        key={day.value}
                        onClick={() => toggleCustomDay(day.value)}
                        className={`aspect-square rounded-lg border-2 flex items-center justify-center text-sm font-medium transition-all ${
                          (config.customDays || []).includes(day.value)
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border hover:border-primary/30'
                        }`}
                      >
                        {day.short}
                      </button>
                    ))}
                  </div>
                  {(config.customDays || []).length === 0 && (
                    <p className="text-xs text-muted-foreground mt-3 text-center">
                      请至少选择一天
                    </p>
                  )}
                </div>
              )}

              {/* 配置预览 */}
              <div className="bg-primary/5 rounded-2xl p-5 border border-primary/20">
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  提醒预览
                </h4>
                <div className="space-y-2 text-sm text-foreground/80">
                  <p>
                    📅 频率：
                    {config.frequency === 'daily' && '每天'}
                    {config.frequency === 'weekly' && '每周日'}
                    {config.frequency === 'custom' && 
                      `每周${(config.customDays || []).map(d => WEEKDAYS[d].short).join('、')}`
                    }
                  </p>
                  <p>
                    🕐 时间：{selectedTime.label} {selectedTime.time}
                  </p>
                  <p className="pt-2 border-t border-primary/20 text-xs text-muted-foreground">
                    💡 提醒内容将包括今日记录数、连续记录天数等，点击可直接进入随机回顾页面
                  </p>
                </div>
              </div>

              {/* 重新订阅按钮 */}
              {!config.subscribed && (
                <div className="mt-4">
                  <button
                    onClick={handleSubscribe}
                    className="w-full h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    <Bell className="w-5 h-5" />
                    <span>授权订阅消息</span>
                  </button>
                  <p className="text-xs text-muted-foreground text-center mt-3">
                    需要授权后才能接收提醒消息
                  </p>
                </div>
              )}
            </>
          )}

          {/* 说明文案 */}
          <div className="bg-muted/30 rounded-2xl p-4 mt-4">
            <h4 className="text-sm font-medium mb-2">💡 关于回顾提醒</h4>
            <div className="space-y-1.5 text-xs text-muted-foreground">
              <p>• 在微信小程序中，使用官方订阅消息功能</p>
              <p>• 每次授权可推送多次消息（长期订阅）</p>
              <p>• 提醒消息会在设定时间准时送达</p>
              <p>• 点击提醒消息可直接打开小程序回顾</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}