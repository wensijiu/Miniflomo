import { motion } from 'motion/react';
import { Note } from './NoteCard';
import { Goals } from './GoalSettings';
import { Flame, Calendar, Hash, Zap, TrendingUp } from 'lucide-react';

interface NotionDashboardV3Props {
  notes: Note[];
  goals: Goals;
}

export function NotionDashboardV3({ notes, goals }: NotionDashboardV3Props) {
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
    <div className="space-y-1.5">
      {/* 方案B: 统一卡片网格 - 所有数据平等 */}
      <div className="grid grid-cols-3 gap-1.5">
        <UniformCard
          icon={<Flame className="w-3.5 h-3.5" />}
          value={streak}
          label="连续"
          goal={goals.streakGoal}
        />
        <UniformCard
          icon={<Calendar className="w-3.5 h-3.5" />}
          value={weeklyCount}
          label="本周"
          goal={goals.weeklyGoal}
        />
        <UniformCard
          icon={<Hash className="w-3.5 h-3.5" />}
          value={totalCount}
          label="总计"
          goal={goals.totalGoal}
        />
        <UniformCard
          icon={<Zap className="w-3.5 h-3.5" />}
          value={todayCount}
          label="今日"
          subtext="条笔记"
        />
        <UniformCard
          icon={<TrendingUp className="w-3.5 h-3.5" />}
          value={avgDaily}
          label="日均"
          subtext="条笔记"
        />
        <div className="bg-[#FAF9F8] rounded-lg p-3 flex flex-col items-center justify-center">
          <div className="text-xl mb-0.5">📊</div>
          <div className="text-xs text-muted-foreground">统计</div>
        </div>
      </div>
    </div>
  );
}

interface UniformCardProps {
  icon: React.ReactNode;
  value: number | string;
  label: string;
  goal?: number;
  subtext?: string;
}

function UniformCard({ icon, value, label, goal, subtext }: UniformCardProps) {
  const progress = goal ? Math.min((Number(value) / goal) * 100, 100) : 100;
  
  return (
    <motion.div
      className="bg-[#FAF9F8] border border-border rounded-lg p-3"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex justify-center text-muted-foreground mb-1.5">
        {icon}
      </div>
      <div className="text-center">
        <div className="text-xl font-semibold mb-0.5">{value}</div>
        <div className="text-xs text-muted-foreground">{label}</div>
        {goal && (
          <div className="text-xs text-muted-foreground opacity-60 mt-0.5">/{goal}</div>
        )}
        {subtext && (
          <div className="text-xs text-muted-foreground opacity-60 mt-0.5">{subtext}</div>
        )}
      </div>
    </motion.div>
  );
}
