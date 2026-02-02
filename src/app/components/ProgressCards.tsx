import { motion } from 'motion/react';
import { Note } from './NoteCard';
import { Goals } from './GoalSettings';
import { Flame, Calendar, Hash } from 'lucide-react';

interface ProgressCardsProps {
  notes: Note[];
  goals: Goals;
}

export function ProgressCards({ notes, goals }: ProgressCardsProps) {
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

  const streakProgress = Math.min((streak / goals.streakGoal) * 100, 100);
  const weeklyProgress = Math.min((weeklyCount / goals.weeklyGoal) * 100, 100);
  const totalProgress = Math.min((totalCount / goals.totalGoal) * 100, 100);

  return (
    <div className="space-y-3">
      {/* 连续天数 */}
      <ProgressCard
        icon={<Flame className="w-4 h-4" />}
        label="连续记录"
        current={streak}
        goal={goals.streakGoal}
        unit="天"
        progress={streakProgress}
        color="bg-[#37352F]"
      />

      {/* 本周笔记 */}
      <ProgressCard
        icon={<Calendar className="w-4 h-4" />}
        label="本周笔记"
        current={weeklyCount}
        goal={goals.weeklyGoal}
        unit="条"
        progress={weeklyProgress}
        color="bg-[#37352F]"
      />

      {/* 总笔记数 */}
      <ProgressCard
        icon={<Hash className="w-4 h-4" />}
        label="总笔记数"
        current={totalCount}
        goal={goals.totalGoal}
        unit="条"
        progress={totalProgress}
        color="bg-[#37352F]"
      />
    </div>
  );
}

interface ProgressCardProps {
  icon: React.ReactNode;
  label: string;
  current: number;
  goal: number;
  unit: string;
  progress: number;
  color: string;
}

function ProgressCard({ icon, label, current, goal, unit, progress, color }: ProgressCardProps) {
  return (
    <div className="bg-accent/30 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="text-muted-foreground">{icon}</div>
          <span className="text-sm text-muted-foreground">{label}</span>
        </div>
        <div className="text-right">
          <span className="text-lg font-medium">{current}</span>
          <span className="text-sm text-muted-foreground"> / {goal}</span>
          <span className="text-xs text-muted-foreground ml-1">{unit}</span>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="relative h-2 bg-accent rounded-full overflow-hidden">
        <motion.div
          className={`absolute inset-y-0 left-0 ${color} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        />
      </div>
      
      {/* Percentage */}
      <div className="text-right mt-2">
        <span className="text-xs font-medium text-primary">{Math.round(progress)}%</span>
      </div>
    </div>
  );
}
