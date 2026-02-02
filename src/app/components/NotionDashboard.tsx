import { motion } from 'motion/react';
import { Note } from './NoteCard';
import { Goals } from './GoalSettings';
import { Flame, Calendar, Hash, TrendingUp, Clock, Zap } from 'lucide-react';

interface NotionDashboardProps {
  notes: Note[];
  goals: Goals;
}

export function NotionDashboard({ notes, goals }: NotionDashboardProps) {
  // 计算连续天数
  const calculateStreak = () => {
    if (notes.length === 0) return 0;
    
    const sortedNotes = [...notes].sort((a, b) => b.timestamp - a.timestamp);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let streak = 0;
    let currentDate = new Date(today);
    
    for (let i = 0; i < 365; i++) {
      const dayStart = new Date(currentDate);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(currentDate);
      dayEnd.setHours(23, 59, 59, 999);
      
      const hasNote = sortedNotes.some(note => {
        const noteDate = new Date(note.timestamp);
        return noteDate >= dayStart && noteDate <= dayEnd;
      });
      
      if (hasNote) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (i === 0) {
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  };

  // 计算本周笔记数
  const getThisWeekCount = () => {
    const now = Date.now();
    const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
    return notes.filter(note => note.timestamp >= weekAgo).length;
  };

  // 计算今日笔记数
  const getTodayCount = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return notes.filter(note => {
      const noteDate = new Date(note.timestamp);
      return noteDate >= today && noteDate < tomorrow;
    }).length;
  };

  // 计算平均每日笔记数
  const getAverageDaily = () => {
    if (notes.length === 0) return 0;
    const oldestNote = Math.min(...notes.map(n => n.timestamp));
    const days = Math.max(1, Math.ceil((Date.now() - oldestNote) / (24 * 60 * 60 * 1000)));
    return (notes.length / days).toFixed(1);
  };

  const streak = calculateStreak();
  const weeklyCount = getThisWeekCount();
  const totalCount = notes.length;
  const todayCount = getTodayCount();
  const avgDaily = getAverageDaily();

  return (
    <div className="space-y-2">
      {/* 主要指标 - 紧凑版 */}
      <div className="grid grid-cols-2 gap-2">
        <CompactMetricCard
          icon={<Flame className="w-4 h-4" />}
          value={streak}
          label="连续天数"
          goal={goals.streakGoal}
          progress={(streak / goals.streakGoal) * 100}
        />
        <CompactMetricCard
          icon={<Calendar className="w-4 h-4" />}
          value={weeklyCount}
          label="本周笔记"
          goal={goals.weeklyGoal}
          progress={(weeklyCount / goals.weeklyGoal) * 100}
        />
      </div>

      {/* 次要指标 - 单行紧凑 */}
      <div className="bg-accent/30 rounded-xl p-3 flex items-center justify-around">
        <InlineMetric
          icon={<Hash className="w-3.5 h-3.5" />}
          value={totalCount}
          label="总计"
          subtext={`/${goals.totalGoal}`}
        />
        <div className="w-px h-8 bg-border" />
        <InlineMetric
          icon={<Zap className="w-3.5 h-3.5" />}
          value={todayCount}
          label="今日"
          subtext="条"
        />
        <div className="w-px h-8 bg-border" />
        <InlineMetric
          icon={<TrendingUp className="w-3.5 h-3.5" />}
          value={avgDaily}
          label="日均"
          subtext="条"
        />
      </div>
    </div>
  );
}

interface MetricCardProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  goal: string;
  progress: number;
  accent: string;
}

function MetricCard({ icon, value, label, goal, progress, accent }: MetricCardProps) {
  const clampedProgress = Math.min(progress, 100);
  
  return (
    <motion.div
      className={`${accent} border border-border rounded-2xl p-4`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="text-muted-foreground">{icon}</div>
        <span className="text-xs text-muted-foreground">{Math.round(clampedProgress)}%</span>
      </div>
      
      <div className="mb-1">
        <span className="text-3xl font-medium">{value}</span>
      </div>
      
      <div className="text-sm text-muted-foreground mb-3">{label}</div>
      
      {/* Progress bar */}
      <div className="relative h-1.5 bg-accent rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        />
      </div>
      
      <div className="text-xs text-muted-foreground mt-2">{goal}</div>
    </motion.div>
  );
}

interface MiniMetricCardProps {
  icon: React.ReactNode;
  value: number | string;
  label: string;
  subtext: string;
}

function MiniMetricCard({ icon, value, label, subtext }: MiniMetricCardProps) {
  return (
    <motion.div
      className="bg-accent/30 rounded-xl p-3 text-center"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <div className="text-muted-foreground flex justify-center mb-1">
        {icon}
      </div>
      <div className="text-xl font-medium mb-0.5">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-xs text-muted-foreground opacity-60">{subtext}</div>
    </motion.div>
  );
}

interface CompactMetricCardProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  goal: number;
  progress: number;
}

function CompactMetricCard({ icon, value, label, goal, progress }: CompactMetricCardProps) {
  const clampedProgress = Math.min(progress, 100);
  
  return (
    <motion.div
      className="bg-accent/30 border border-border rounded-2xl p-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="text-muted-foreground">{icon}</div>
        <span className="text-xs text-muted-foreground">{Math.round(clampedProgress)}%</span>
      </div>
      
      <div className="mb-1">
        <span className="text-3xl font-medium">{value}</span>
      </div>
      
      <div className="text-sm text-muted-foreground mb-3">{label}</div>
      
      {/* Progress bar */}
      <div className="relative h-1.5 bg-accent rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        />
      </div>
      
      <div className="text-xs text-muted-foreground mt-2">目标 {goal} 天</div>
    </motion.div>
  );
}

interface InlineMetricProps {
  icon: React.ReactNode;
  value: number | string;
  label: string;
  subtext: string;
}

function InlineMetric({ icon, value, label, subtext }: InlineMetricProps) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className="text-muted-foreground">{icon}</div>
      <div className="text-lg font-medium">{value}<span className="text-xs text-muted-foreground ml-0.5">{subtext}</span></div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}