import { useState } from 'react';
import { Smartphone, Hash } from 'lucide-react';
import { sendVerificationCode } from '@/app/utils/api';

interface AuthPageProps {
  onLogin: (phone: string, code: string) => void;
  onRegister: (phone: string, code: string, nickname: string) => void;
}

export function AuthPage({ onLogin, onRegister }: AuthPageProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [nickname, setNickname] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [isSending, setIsSending] = useState(false);

  const handleSendCode = async () => {
    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      alert('请输入正确的手机号');
      return;
    }
    
    setIsSending(true);
    const result = await sendVerificationCode(phone);
    setIsSending(false);

    if (result.success) {
      // 开发环境显示验证码
      if (result.devCode) {
        alert(`验证码已发送到 ${phone}\n（开发环境验证码：${result.devCode}）`);
      } else {
        alert(`验证码已发送到 ${phone}`);
      }
      
      // 开始倒计时
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      alert(result.error || '发送验证码失败，请重试');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      onLogin(phone, code);
    } else {
      onRegister(phone, code, nickname);
    }
  };

  const isValid = mode === 'login' 
    ? phone && code 
    : phone && code && nickname;

  return (
    <div className="h-full bg-background flex flex-col items-center justify-center px-6">
      {/* Logo & Title */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
          <span className="text-4xl">📝</span>
        </div>
        <h1 className="text-2xl font-medium text-foreground">ria</h1>
      </div>

      {/* Auth Form */}
      <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-sm">
        {/* Tab Switcher */}
        <div className="flex gap-2 mb-6 bg-accent rounded-lg p-1">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              mode === 'login'
                ? 'bg-white text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            登录
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              mode === 'register'
                ? 'bg-white text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            注册
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nickname (Register only) */}
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                昵称
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="输入你的昵称"
                  className="w-full px-4 py-2.5 bg-accent rounded-lg outline-none focus:ring-2 focus:ring-primary text-sm"
                  required={mode === 'register'}
                />
              </div>
            </div>
          )}

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              手机号
            </label>
            <div className="relative">
              <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="输入手机号"
                className="w-full pl-10 pr-4 py-2.5 bg-accent rounded-lg outline-none focus:ring-2 focus:ring-primary text-sm"
                required
                maxLength={11}
              />
            </div>
          </div>

          {/* Verification Code */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              验证码
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="输入验证码"
                  className="w-full pl-10 pr-4 py-2.5 bg-accent rounded-lg outline-none focus:ring-2 focus:ring-primary text-sm"
                  required
                  maxLength={6}
                />
              </div>
              <button
                type="button"
                onClick={handleSendCode}
                disabled={countdown > 0 || !phone || isSending}
                className="px-4 py-2.5 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {countdown > 0 ? `${countdown}s` : '获取验证码'}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isValid}
            className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {mode === 'login' ? '登录' : '注册'}
          </button>
        </form>

        {/* Additional Info */}
        {mode === 'register' && (
          <p className="text-xs text-muted-foreground text-center mt-4">
            注册即表示同意服务条款和隐私政策
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-xs text-muted-foreground">
          © 2026 ria
        </p>
      </div>
    </div>
  );
}