import { Edit3, Eye, Tags, User } from 'lucide-react';

interface TabBarProps {
  activeTab: 'input' | 'review' | 'tags' | 'profile';
  onTabChange: (tab: 'input' | 'review' | 'tags' | 'profile') => void;
}

export function TabBar({ activeTab, onTabChange }: TabBarProps) {
  const tabs = [
    { id: 'input' as const, label: '记录', icon: Edit3 },
    { id: 'review' as const, label: '回顾', icon: Eye },
    { id: 'tags' as const, label: '标签', icon: Tags },
    { id: 'profile' as const, label: '我的', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
