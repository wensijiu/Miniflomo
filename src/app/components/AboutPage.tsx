import { X, Heart, Github, Mail } from 'lucide-react';

interface AboutPageProps {
  onClose: () => void;
}

export function AboutPage({ onClose }: AboutPageProps) {
  const version = '1.0.0';
  const buildDate = '2026.01';

  return (
    <div className="fixed inset-0 bg-background z-50">
      <div className="h-screen flex flex-col max-w-lg mx-auto">
        {/* Header */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-border bg-white sticky top-0 z-10">
          <div className="w-8" />
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-accent transition-colors text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
          <h1 className="text-base absolute left-1/2 -translate-x-1/2">关于 ria</h1>
          <div className="w-8" />
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Hero Section */}
          <div className="px-4 pt-8 pb-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
              <span className="text-4xl">📝</span>
            </div>
            <h2 className="text-2xl font-medium mb-2">ria</h2>
          </div>

          <div className="px-4 pb-4">
            {/* Core Features */}
            <div className="bg-white rounded-2xl p-5 mb-4 border border-border">
              <h3 className="text-base font-medium mb-4">核心功能</h3>
              <div className="space-y-4">
                <FeatureItem
                  icon="⚡️"
                  title="快速记录"
                  desc="打开即写，支持一键添加标签"
                />
                <FeatureItem
                  icon="🏷️"
                  title="标签管理"
                  desc="扁平化标签结构，快速筛选和查找"
                />
                <FeatureItem
                  icon="🔀"
                  title="随机回顾"
                  desc="让过往的思考重新浮现"
                />
                <FeatureItem
                  icon="📊"
                  title="数据统计"
                  desc="可视化记录习惯，自定义成长目标"
                />
                <FeatureItem
                  icon="📅"
                  title="日历视图"
                  desc="时间轴方式查看记录轨迹"
                />
                <FeatureItem
                  icon="🔔"
                  title="定时提醒"
                  desc="养成每日回顾的习惯"
                />
              </div>
            </div>

            {/* Contact & Links */}
            <div className="bg-white rounded-2xl p-5 mb-4 border border-border">
              <h3 className="text-base font-medium mb-3">联系与反馈</h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                有任何问题或建议，欢迎随时联系我们
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => window.open('https://github.com/weimo-note', '_blank')}
                  className="flex items-center justify-center gap-2 h-10 px-4 bg-accent/50 rounded-xl hover:bg-accent transition-colors text-sm"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                </button>
                <button
                  onClick={() => window.location.href = 'mailto:feedback@weimo.app'}
                  className="flex items-center justify-center gap-2 h-10 px-4 bg-accent/50 rounded-xl hover:bg-accent transition-colors text-sm"
                >
                  <Mail className="w-4 h-4" />
                  <span>邮箱反馈</span>
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center py-6 space-y-3">
              <div className="text-xs text-muted-foreground space-y-1">
                <p>v{version} • {buildDate}</p>
                <p>© 2026 ria. All rights reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-base mt-0.5">{icon}</div>
      <div className="flex-1">
        <h4 className="text-sm font-medium mb-0.5">{title}</h4>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}