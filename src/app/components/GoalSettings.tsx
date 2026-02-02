import { useState, useEffect } from 'react';
import { X, Target } from 'lucide-react';
import { motion } from 'motion/react';

interface GoalSettingsProps {
  onClose: () => void;
  onGoalsChange: (goals: Goals) => void;
  goals: Goals;
}

export interface Goals {
  streakGoal: number | null;
  weeklyGoal: number | null;
  totalGoal: number | null;
}

export function GoalSettings({ onClose, onGoalsChange, goals }: GoalSettingsProps) {
  const [streakGoal, setStreakGoal] = useState(goals.streakGoal);
  const [weeklyGoal, setWeeklyGoal] = useState(goals.weeklyGoal);
  const [totalGoal, setTotalGoal] = useState(goals.totalGoal);

  const handleSave = () => {
    const newGoals = {
      streakGoal: streakGoal && streakGoal > 0 ? Math.max(1, streakGoal) : null,
      weeklyGoal: weeklyGoal && weeklyGoal > 0 ? Math.max(1, weeklyGoal) : null,
      totalGoal: totalGoal && totalGoal > 0 ? Math.max(1, totalGoal) : null,
    };
    saveGoals(newGoals);
    onGoalsChange(newGoals);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        className="bg-white rounded-3xl w-full max-w-md overflow-hidden"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-medium">周期目标设置</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-accent/50 transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <p className="text-sm text-muted-foreground">
            设置你的个人目标，为自己的记录习惯加油💪
          </p>

          {/* 连续天数目标 */}
          <div>
            <label className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full bg-[#FF3B30]" />
              <span className="text-sm font-medium">连续记录目标</span>
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="1"
                max="365"
                value={streakGoal !== null ? streakGoal : ''}
                onChange={(e) => setStreakGoal(Number(e.target.value))}
                className="flex-1 px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-lg"
              />
              <span className="text-muted-foreground min-w-[3rem]">天</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              建议：7天 / 14天 / 30天
            </p>
          </div>

          {/* 本周笔记目标 */}
          <div>
            <label className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full bg-[#34C759]" />
              <span className="text-sm font-medium">本周笔记目标</span>
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="1"
                max="100"
                value={weeklyGoal !== null ? weeklyGoal : ''}
                onChange={(e) => setWeeklyGoal(Number(e.target.value))}
                className="flex-1 px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-lg"
              />
              <span className="text-muted-foreground min-w-[3rem]">条</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              建议：每天1条 = 7条/周
            </p>
          </div>

          {/* 总笔记目标 */}
          <div>
            <label className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full bg-[#007AFF]" />
              <span className="text-sm font-medium">总笔记里程碑</span>
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="1"
                max="10000"
                value={totalGoal !== null ? totalGoal : ''}
                onChange={(e) => setTotalGoal(Number(e.target.value))}
                className="flex-1 px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-lg"
              />
              <span className="text-muted-foreground min-w-[3rem]">条</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              建议：50 / 100 / 200 / 500 / 1000
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-border flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-xl border border-border hover:bg-accent/50 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
          >
            保存目标
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// 默认目标
export const DEFAULT_GOALS: Goals = {
  streakGoal: null,
  weeklyGoal: null,
  totalGoal: null,
};

// 从 localStorage 加载目标
export function loadGoals(): Goals {
  try {
    const saved = localStorage.getItem('goals');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Failed to load goals:', error);
  }
  return DEFAULT_GOALS;
}

// 保存目标到 localStorage
export function saveGoals(goals: Goals) {
  try {
    localStorage.setItem('goals', JSON.stringify(goals));
  } catch (error) {
    console.error('Failed to save goals:', error);
  }
}