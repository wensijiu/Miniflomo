import { motion } from 'motion/react';
import { Note } from './NoteCard';
import { Goals } from './GoalSettings';

interface AchievementRingsProps {
  notes: Note[];
  goals: Goals;
}

export function AchievementRings({ notes, goals }: AchievementRingsProps) {
  // 计算连续记录天数
  const getStreak = () => {
    if (notes.length === 0) return 0;
    
    const sortedNotes = [...notes].sort((a, b) => b.timestamp - a.timestamp);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let streak = 0;
    let currentDate = today;
    
    for (let i = 0; i < 30; i++) {
      const dayStart = currentDate.getTime();
      const dayEnd = dayStart + 24 * 60 * 60 * 1000;
      
      const hasNote = sortedNotes.some(
        note => note.timestamp >= dayStart && note.timestamp < dayEnd
      );
      
      if (hasNote) {
        streak++;
        currentDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
      } else if (i === 0) {
        currentDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
      } else {
        break;
      }
    }
    
    return streak;
  };

  // 计算本周笔记数
  const getWeeklyNotes = () => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1); // 周一开始
    
    return notes.filter(note => note.timestamp >= startOfWeek.getTime()).length;
  };

  // 计算总笔记数
  const getTotalNotes = () => notes.length;

  const streak = getStreak();
  const weeklyNotes = getWeeklyNotes();
  const totalNotes = getTotalNotes();

  // 目标设定
  const streakGoal = goals.streakGoal; // 用户设置的连续天数目标
  const weeklyGoal = goals.weeklyGoal; // 用户设置的每周笔记目标
  const totalGoal = goals.totalGoal; // 用户设置的总笔记目标

  // 计算进度
  const streakProgress = Math.min((streak / streakGoal) * 100, 100);
  const weeklyProgress = Math.min((weeklyNotes / weeklyGoal) * 100, 100);
  const totalProgress = Math.min((totalNotes / totalGoal) * 100, 100);

  // 检查是否全部完成
  const allCompleted = streakProgress === 100 && weeklyProgress === 100 && totalProgress === 100;

  return (
    <div className="relative w-full aspect-square max-w-[220px] mx-auto">
      {/* 庆祝粒子效果 */}
      {allCompleted && (
        <>
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute top-1/2 left-1/2 w-2 h-2 bg-yellow-400 rounded-full"
              initial={{ scale: 0, x: 0, y: 0 }}
              animate={{
                scale: [0, 1, 0],
                x: Math.cos((i * Math.PI * 2) / 8) * 80,
                y: Math.sin((i * Math.PI * 2) / 8) * 80,
              }}
              transition={{
                duration: 1.5,
                delay: 1.2,
                repeat: Infinity,
                repeatDelay: 3,
              }}
            />
          ))}
        </>
      )}

      {/* SVG 圆环 */}
      <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
        {/* 背景圆环 */}
        <circle
          cx="100"
          cy="100"
          r="85"
          fill="none"
          stroke="#F5F5F4"
          strokeWidth="7"
        />
        <circle
          cx="100"
          cy="100"
          r="70"
          fill="none"
          stroke="#F5F5F4"
          strokeWidth="7"
        />
        <circle
          cx="100"
          cy="100"
          r="55"
          fill="none"
          stroke="#F5F5F4"
          strokeWidth="7"
        />

        {/* 进度圆环 - 外圈（连续天数 - 红色） */}
        <motion.circle
          cx="100"
          cy="100"
          r="85"
          fill="none"
          stroke="#FF3B30"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * 85}`}
          initial={{ strokeDashoffset: 2 * Math.PI * 85 }}
          animate={{ 
            strokeDashoffset: 2 * Math.PI * 85 * (1 - streakProgress / 100)
          }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        />

        {/* 进度圆环 - 中圈（本周笔记 - 绿色） */}
        <motion.circle
          cx="100"
          cy="100"
          r="70"
          fill="none"
          stroke="#34C759"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * 70}`}
          initial={{ strokeDashoffset: 2 * Math.PI * 70 }}
          animate={{ 
            strokeDashoffset: 2 * Math.PI * 70 * (1 - weeklyProgress / 100)
          }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
        />

        {/* 进度圆环 - 内圈（总笔记数 - 蓝色） */}
        <motion.circle
          cx="100"
          cy="100"
          r="55"
          fill="none"
          stroke="#007AFF"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * 55}`}
          initial={{ strokeDashoffset: 2 * Math.PI * 55 }}
          animate={{ 
            strokeDashoffset: 2 * Math.PI * 55 * (1 - totalProgress / 100)
          }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
        />
      </svg>

      {/* 中央数据显示 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <motion.div 
            className="text-3xl font-bold text-foreground mb-0.5"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: allCompleted ? [1, 1.1, 1] : 1 }}
            transition={{ 
              opacity: { duration: 0.5, delay: 0.8 },
              scale: allCompleted ? { 
                duration: 0.5, 
                delay: 1.2, 
                repeat: Infinity,
                repeatDelay: 3 
              } : { duration: 0.5, delay: 0.8 }
            }}
          >
            {totalNotes}
          </motion.div>
          <motion.div 
            className="text-xs text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            总笔记
          </motion.div>
          {allCompleted && (
            <motion.div
              className="text-xl mt-1"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1.2 }}
            >
              🎉
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

interface RingLegendProps {
  notes: Note[];
  goals: Goals;
}

export function RingLegend({ notes, goals }: RingLegendProps) {
  const getStreak = () => {
    if (notes.length === 0) return 0;
    
    const sortedNotes = [...notes].sort((a, b) => b.timestamp - a.timestamp);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let streak = 0;
    let currentDate = today;
    
    for (let i = 0; i < 30; i++) {
      const dayStart = currentDate.getTime();
      const dayEnd = dayStart + 24 * 60 * 60 * 1000;
      
      const hasNote = sortedNotes.some(
        note => note.timestamp >= dayStart && note.timestamp < dayEnd
      );
      
      if (hasNote) {
        streak++;
        currentDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
      } else if (i === 0) {
        currentDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
      } else {
        break;
      }
    }
    
    return streak;
  };

  const getWeeklyNotes = () => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1);
    
    return notes.filter(note => note.timestamp >= startOfWeek.getTime()).length;
  };

  const getTotalNotes = () => notes.length;

  const streak = getStreak();
  const weeklyNotes = getWeeklyNotes();
  const totalNotes = getTotalNotes();

  const streakGoal = goals.streakGoal;
  const weeklyGoal = goals.weeklyGoal;
  const totalGoal = goals.totalGoal;

  return (
    <div className="grid grid-cols-3 gap-3">
      <RingLegendItem
        color="bg-[#FF3B30]"
        label="连续天数"
        value={streak}
        goal={streakGoal}
        unit="天"
      />
      <RingLegendItem
        color="bg-[#34C759]"
        label="本周笔记"
        value={weeklyNotes}
        goal={weeklyGoal}
        unit="条"
      />
      <RingLegendItem
        color="bg-[#007AFF]"
        label="总笔记"
        value={totalNotes}
        goal={totalGoal}
        unit="条"
      />
    </div>
  );
}

interface RingLegendItemProps {
  color: string;
  label: string;
  value: number;
  goal: number;
  unit: string;
}

function RingLegendItem({ color, label, value, goal, unit }: RingLegendItemProps) {
  const isCompleted = value >= goal;
  const progress = Math.min((value / goal) * 100, 100);

  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-center gap-1.5 mb-1.5">
        <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <div className="text-xl font-semibold text-foreground mb-0.5">
        {value}
        <span className="text-sm text-muted-foreground font-normal ml-0.5">
          /{goal}{unit}
        </span>
      </div>
      <div className="text-xs text-muted-foreground">
        {isCompleted ? (
          <motion.span
            className="text-green-600 font-medium"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
          >
            ✨ 已完成
          </motion.span>
        ) : (
          <span>{Math.round(progress)}%</span>
        )}
      </div>
    </motion.div>
  );
}