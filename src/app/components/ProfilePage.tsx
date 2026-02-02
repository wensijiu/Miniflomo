import { Bell, HelpCircle, Info, TrendingUp, Calendar, Shuffle, Target, LogOut } from 'lucide-react';
import { Note } from './NoteCard';
import { NotionDashboardV4 } from './NotionDashboardV4';
import { Goals } from './GoalSettings';

interface ProfilePageProps {
  notes: Note[];
  onRandomReview: () => void;
  onStats: () => void;
  onGoalSettings: () => void;
  onCalendar: () => void;
  onReminderSettings: () => void;
  onAbout: () => void;
  onHelp: () => void;
  onLogout: () => void;
  goals: Goals;
  userNickname?: string;
}

export function ProfilePage({ notes, onRandomReview, onStats, onGoalSettings, onCalendar, onReminderSettings, onAbout, onHelp, onLogout, goals, userNickname }: ProfilePageProps) {
  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto">
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-10">
        <div className="flex items-center justify-center h-14 border-b border-border">
          <h1 className="text-base font-medium">我的</h1>
        </div>
        
        {/* Profile Section */}
        <div className="px-4 sm:px-6 py-4 sm:py-5">
          <div className="flex items-center gap-3.5 sm:gap-4 mb-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xl sm:text-2xl">📝</span>
            </div>
            <div className="flex-1">
              <h2 className="text-base sm:text-lg font-medium">{userNickname || 'ria 用户'}</h2>
            </div>
          </div>

          {/* Only show NotionDashboardV4 */}
          <NotionDashboardV4 notes={notes} goals={goals} />
          
          {/* Show goal setting hint if no goals are set */}
          {(goals.streakGoal === null || goals.weeklyGoal === null || goals.totalGoal === null) && (
            <div className="mt-4 bg-primary/5 rounded-xl p-3.5 flex items-center gap-2.5">
              <span className="text-base">💡</span>
              <p className="text-xs sm:text-sm text-muted-foreground flex-1">
                还没有设置目标？
                <button 
                  onClick={onGoalSettings}
                  className="text-primary font-medium ml-1 hover:underline"
                >
                  去设置
                </button>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="pb-20 pt-3">
        {/* Highlight Feature - Random Review */}
        <div className="px-4 sm:px-6 mb-3">
          <button
            onClick={onRandomReview}
            className="w-full bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl sm:rounded-2xl p-4 sm:p-5 text-left hover:from-primary/15 hover:to-primary/10 transition-all active:scale-98"
          >
            <div className="flex items-center gap-3.5 sm:gap-4">
              <div className="w-11 h-11 sm:w-12 sm:h-12 bg-primary rounded-xl flex items-center justify-center">
                <Shuffle className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm sm:text-base font-medium mb-1">随机回顾</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">重温过往的思考</p>
              </div>
              <div className="text-primary text-xl sm:text-2xl">→</div>
            </div>
          </button>
        </div>

        {/* Menu Items */}
        <div className="px-4 sm:px-6">
          <div className="bg-white rounded-2xl overflow-hidden mb-3">
            <MenuItem
              icon={<Target className="w-5 h-5" />}
              label="目标设置"
              description="设置你的周期目标"
              onClick={onGoalSettings}
            />
            <MenuItem
              icon={<TrendingUp className="w-5 h-5" />}
              label="数据统"
              onClick={onStats}
            />
            <MenuItem
              icon={<Calendar className="w-5 h-5" />}
              label="记录日历"
              onClick={onCalendar}
            />
            <MenuItem
              icon={<Bell className="w-5 h-5" />}
              label="回顾提醒"
              description="每日定时提醒回顾"
              onClick={onReminderSettings}
              showBorder={false}
            />
          </div>

          <div className="bg-white rounded-2xl overflow-hidden mb-3">
            <MenuItem
              icon={<Info className="w-5 h-5" />}
              label="关于 ria"
              onClick={onAbout}
            />
            <MenuItem
              icon={<HelpCircle className="w-5 h-5" />}
              label="帮助与反馈"
              onClick={onHelp}
              showBorder={false}
            />
          </div>

          <div className="bg-white rounded-2xl overflow-hidden mb-3">
            <MenuItem
              icon={<LogOut className="w-5 h-5" />}
              label="退出登录"
              onClick={onLogout}
              showBorder={false}
            />
          </div>

          <div className="bg-white rounded-2xl overflow-hidden">
            <MenuItem
              icon={<span className="text-destructive">⚠️</span>}
              label="清空所有数据"
              description="仅用于测试，将删除所有笔记"
              onClick={() => {
                if (window.confirm('确定要清空所有数据吗？此操作不可恢复！')) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
              showBorder={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  description?: string;
  onClick: () => void;
  showBorder?: boolean;
}

function MenuItem({ icon, label, description, onClick, showBorder = true }: MenuItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-5 py-4 hover:bg-accent/50 transition-colors text-left ${
        showBorder ? 'border-b border-border' : ''
      }`}
    >
      <div className="text-primary">{icon}</div>
      <div className="flex-1">
        <div className="text-foreground">{label}</div>
        {description && (
          <div className="text-sm text-muted-foreground mt-0.5">{description}</div>
        )}
      </div>
      <div className="text-muted-foreground">›</div>
    </button>
  );
}