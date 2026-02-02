import { motion } from 'motion/react';
import { Note } from './NoteCard';
import { Goals } from './GoalSettings';
import { Flame, Calendar, Hash } from 'lucide-react';

interface StatsWithMiniRingsProps {
  notes: Note[];
  goals: Goals;
}

export function StatsWithMiniRings({ notes, goals }: StatsWithMiniRingsProps) {
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
    <div>
      {/* Stats Cards - 数据前置 */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <StatCard
          icon={<Flame className="w-4 h-4" />}
          value={streak}
          label="连续天数"
          color="text-[#FF3B30]"
        />
        <StatCard
          icon={<Calendar className="w-4 h-4" />}
          value={weeklyCount}
          label="本周笔记"
          color="text-[#34C759]"
        />
        <StatCard
          icon={<Hash className="w-4 h-4" />}
          value={totalCount}
          label="总笔记"
          color="text-[#007AFF]"
        />
      </div>

      {/* Mini Achievement Rings */}
      <div className="bg-accent/30 rounded-2xl p-4 flex items-center justify-center">
        <div className="flex items-center gap-6">
          <MiniRing progress={streakProgress} color="#FF3B30" label="连续" />
          <MiniRing progress={weeklyProgress} color="#34C759" label="本周" />
          <MiniRing progress={totalProgress} color="#007AFF" label="总计" />
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  color: string;
}

function StatCard({ icon, value, label, color }: StatCardProps) {
  return (
    <div className="bg-accent/30 rounded-xl p-3 text-center">
      <div className={`flex items-center justify-center ${color} mb-1`}>
        {icon}
      </div>
      <div className="text-2xl font-medium mb-0.5">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

interface MiniRingProps {
  progress: number;
  color: string;
  label: string;
}

function MiniRing({ progress, color, label }: MiniRingProps) {
  const radius = 28;
  const strokeWidth = 4;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative">
        <svg width={radius * 2} height={radius * 2}>
          {/* Background circle */}
          <circle
            cx={radius}
            cy={radius}
            r={normalizedRadius}
            fill="none"
            stroke="#E0E0E0"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <motion.circle
            cx={radius}
            cy={radius}
            r={normalizedRadius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            strokeLinecap="round"
            transform={`rotate(-90 ${radius} ${radius})`}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
          />
        </svg>
        {/* Percentage */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-medium">{Math.round(progress)}%</span>
        </div>
      </div>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}
