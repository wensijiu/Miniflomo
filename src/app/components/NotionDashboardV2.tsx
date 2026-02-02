import { motion } from 'motion/react';
import { Note } from './NoteCard';
import { Goals } from './GoalSettings';
import { Flame, Calendar, Hash, Zap, TrendingUp } from 'lucide-react';

interface NotionDashboardV2Props {
  notes: Note[];
  goals: Goals;
}

export function NotionDashboardV2({ notes, goals }: NotionDashboardV2Props) {
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
    <div className="space-y-2.5">
      {/* 方案A: 数字为王 - 极简大数字 */}
      <div className="bg-[#FAF9F8] border border-border rounded-xl p-4">
        <div className="grid grid-cols-3 gap-4">
          <BigNumberStat
            icon={<Flame className="w-4 h-4" />}
            value={streak}
            label="天连续"
            goal={goals.streakGoal}
          />
          <BigNumberStat
            icon={<Calendar className="w-4 h-4" />}
            value={weeklyCount}
            label="本周笔记"
            goal={goals.weeklyGoal}
          />
          <BigNumberStat
            icon={<Hash className="w-4 h-4" />}
            value={totalCount}
            label="总笔记"
            goal={goals.totalGoal}
          />
        </div>
      </div>

      {/* 次要数据 - 超级简洁 */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Zap className="w-3 h-3" />
          <span>今日 {todayCount} 条</span>
        </div>
        <span>·</span>
        <div className="flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          <span>日均 {avgDaily} 条</span>
        </div>
      </div>
    </div>
  );
}

interface BigNumberStatProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  goal: number;
}

function BigNumberStat({ icon, value, label, goal }: BigNumberStatProps) {
  const progress = Math.min((value / goal) * 100, 100);
  
  return (
    <div className="text-center">
      <div className="flex justify-center text-muted-foreground mb-1">
        {icon}
      </div>
      <motion.div
        className="text-2xl font-semibold mb-0.5"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {value}
      </motion.div>
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <div className="flex items-center justify-center gap-1">
        <div className="h-1 w-8 bg-accent rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
          />
        </div>
        <span className="text-xs text-muted-foreground">/{goal}</span>
      </div>
    </div>
  );
}
