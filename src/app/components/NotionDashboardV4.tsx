import { motion } from 'motion/react';
import { Note } from './NoteCard';
import { Goals } from './GoalSettings';
import { Flame, Calendar, Hash } from 'lucide-react';

interface NotionDashboardV4Props {
  notes: Note[];
  goals: Goals;
}

export function NotionDashboardV4({ notes, goals }: NotionDashboardV4Props) {
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

  const streak = calculateStreak();
  const weeklyCount = getThisWeekCount();
  const totalCount = notes.length;

  return (
    <div>
      {/* 方案C: 横向数据条 - 简洁一行 */}
      <div className="bg-[#FAF9F8] border border-border rounded-xl p-4">
        <div className="flex items-center justify-around">
          <DataPill
            icon={<Flame className="w-4 h-4" />}
            value={streak}
            goal={goals.streakGoal}
            label="连续天数"
          />
          <div className="w-px h-10 bg-border" />
          <DataPill
            icon={<Calendar className="w-4 h-4" />}
            value={weeklyCount}
            goal={goals.weeklyGoal}
            label="本周笔记"
          />
          <div className="w-px h-10 bg-border" />
          <DataPill
            icon={<Hash className="w-4 h-4" />}
            value={totalCount}
            goal={goals.totalGoal}
            label="总笔记"
          />
        </div>
      </div>
    </div>
  );
}

interface DataPillProps {
  icon: React.ReactNode;
  value: number;
  goal: number | null;
  label: string;
}

function DataPill({ icon, value, goal, label }: DataPillProps) {
  const progress = goal !== null ? Math.min((value / goal) * 100, 100) : 0;
  
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-1.5 mb-1.5">
        <div className="text-muted-foreground">{icon}</div>
        <motion.span
          className="text-2xl font-semibold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {value}
        </motion.span>
      </div>
      <div className="text-xs text-muted-foreground mb-1.5">{label}</div>
      {goal !== null ? (
        <div className="flex items-center gap-1">
          <div className="h-1 w-12 bg-accent rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
            />
          </div>
          <span className="text-xs text-muted-foreground">/{goal}</span>
        </div>
      ) : (
        <div className="text-xs text-muted-foreground">未设置</div>
      )}
    </div>
  );
}