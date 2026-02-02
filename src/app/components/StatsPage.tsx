import { useState } from 'react';
import { X } from 'lucide-react';
import { Note } from './NoteCard';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface StatsPageProps {
  notes: Note[];
  onClose: () => void;
}

export function StatsPage({ notes, onClose }: StatsPageProps) {
  const [trendPeriod, setTrendPeriod] = useState<7 | 30>(7);

  // 计算基础数据
  const getTotalNotes = () => notes.length;

  const getRecordingDays = () => {
    if (notes.length === 0) return 0;
    const timestamps = notes.map(n => n.timestamp);
    const firstNote = Math.min(...timestamps);
    const now = Date.now();
    return Math.floor((now - firstNote) / (1000 * 60 * 60 * 24)) + 1;
  };

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

  // 本周笔记数
  const getThisWeekNotes = () => {
    const now = new Date();
    const dayOfWeek = now.getDay() || 7; // 周日为0，转换为7
    const mondayStart = new Date(now);
    mondayStart.setDate(now.getDate() - dayOfWeek + 1);
    mondayStart.setHours(0, 0, 0, 0);
    
    return notes.filter(note => note.timestamp >= mondayStart.getTime()).length;
  };

  // 今日笔记数
  const getTodayNotes = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStart = today.getTime();
    const todayEnd = todayStart + 24 * 60 * 60 * 1000;
    
    return notes.filter(note => note.timestamp >= todayStart && note.timestamp < todayEnd).length;
  };

  // 本月笔记数
  const getThisMonthNotes = () => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    monthStart.setHours(0, 0, 0, 0);
    
    return notes.filter(note => note.timestamp >= monthStart.getTime()).length;
  };

  // 日均笔记数
  const getAvgNotesPerDay = () => {
    const days = getRecordingDays();
    if (days === 0) return '0';
    return (getTotalNotes() / days).toFixed(1);
  };

  const getTotalTags = () => {
    const allTags = notes.flatMap(note => note.tags);
    return new Set(allTags).size;
  };

  // 记录趋势数据
  const getTrendData = () => {
    const days = trendPeriod;
    const data = [];
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayStart = date.getTime();
      const dayEnd = dayStart + 24 * 60 * 60 * 1000;

      const count = notes.filter(
        note => note.timestamp >= dayStart && note.timestamp < dayEnd
      ).length;

      data.push({
        date: `${date.getMonth() + 1}/${date.getDate()}`,
        count,
      });
    }

    return data;
  };

  // 最常用标签 TOP 5
  const getTopTags = () => {
    const tagCounts = notes.reduce((acc, note) => {
      note.tags.forEach(tag => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  };

  // 最活跃时段
  const getActiveTimeSlot = () => {
    const timeSlots = { morning: 0, afternoon: 0, evening: 0 };

    notes.forEach(note => {
      const hour = new Date(note.timestamp).getHours();
      if (hour >= 6 && hour < 12) timeSlots.morning++;
      else if (hour >= 12 && hour < 18) timeSlots.afternoon++;
      else timeSlots.evening++;
    });

    const max = Math.max(timeSlots.morning, timeSlots.afternoon, timeSlots.evening);
    if (max === 0) return { label: '暂无数据', count: 0, percentage: 0 };

    if (timeSlots.morning === max) 
      return { label: '上午 (6:00-12:00)', count: timeSlots.morning, percentage: (timeSlots.morning / notes.length * 100).toFixed(0) };
    if (timeSlots.afternoon === max) 
      return { label: '下午 (12:00-18:00)', count: timeSlots.afternoon, percentage: (timeSlots.afternoon / notes.length * 100).toFixed(0) };
    return { label: '晚上 (18:00-6:00)', count: timeSlots.evening, percentage: (timeSlots.evening / notes.length * 100).toFixed(0) };
  };

  // 热力图数据（动态周数）
  const getHeatmapData = () => {
    if (notes.length === 0) {
      return { data: [], weeks: 4 }; // 默认4周
    }

    // 计算用户使用周数
    const firstNoteTime = Math.min(...notes.map(n => n.timestamp));
    const now = Date.now();
    const usageDays = Math.floor((now - firstNoteTime) / (1000 * 60 * 60 * 24));
    const usageWeeks = Math.ceil(usageDays / 7);

    // 根据使用时长动态决定显示周数
    let weeks = 4; // 默认最少4周
    if (usageWeeks <= 4) {
      weeks = 4;
    } else if (usageWeeks <= 8) {
      weeks = Math.max(usageWeeks, 6); // 至少显示6周
    } else if (usageWeeks <= 12) {
      weeks = Math.max(usageWeeks, 8); // 至少显示8周
    } else {
      weeks = 12; // 最多12周
    }

    const data: number[][] = Array(7).fill(0).map(() => Array(weeks).fill(0));
    const startDate = new Date(now - weeks * 7 * 24 * 60 * 60 * 1000);
    startDate.setHours(0, 0, 0, 0);

    notes.forEach(note => {
      const noteDate = new Date(note.timestamp);
      const diffTime = noteDate.getTime() - startDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays >= 0 && diffDays < weeks * 7) {
        const weekIndex = Math.floor(diffDays / 7);
        const dayIndex = diffDays % 7;
        if (weekIndex < weeks && dayIndex < 7) {
          data[dayIndex][weekIndex]++;
        }
      }
    });

    return { data, weeks };
  };

  const heatmapData = getHeatmapData();

  // 使用固定的绝对值映射颜色（符合C端用户体感）
  const getHeatColor = (value: number) => {
    if (value === 0) return 'bg-muted';
    if (value === 1) return 'bg-primary/15';
    if (value <= 3) return 'bg-primary/35';
    if (value <= 6) return 'bg-primary/60';
    return 'bg-primary/90'; // 7条及以上
  };

  // 固定的图例范围
  const heatLegendRanges = ['0', '1', '2-3', '4-6', '7+'];

  const trendData = getTrendData();
  const topTags = getTopTags();
  const activeTimeSlot = getActiveTimeSlot();

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between h-14 px-4 border-b border-border bg-white relative">
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-accent transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <h1 className="text-base absolute left-1/2 -translate-x-1/2">数据统计</h1>
        <div className="w-8" />
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <StatsViewA
          getTotalNotes={getTotalNotes}
          getStreak={getStreak}
          getThisWeekNotes={getThisWeekNotes}
          getTodayNotes={getTodayNotes}
          getThisMonthNotes={getThisMonthNotes}
          getAvgNotesPerDay={getAvgNotesPerDay}
          getRecordingDays={getRecordingDays}
          trendPeriod={trendPeriod}
          setTrendPeriod={setTrendPeriod}
          trendData={trendData}
          topTags={topTags}
          activeTimeSlot={activeTimeSlot}
          heatmapData={heatmapData}
          getHeatColor={getHeatColor}
          heatLegendRanges={heatLegendRanges}
        />
      </div>
    </div>
  );
}

interface StatsViewAProps {
  getTotalNotes: () => number;
  getStreak: () => number;
  getThisWeekNotes: () => number;
  getTodayNotes: () => number;
  getThisMonthNotes: () => number;
  getAvgNotesPerDay: () => string;
  getRecordingDays: () => number;
  trendPeriod: 7 | 30;
  setTrendPeriod: (period: 7 | 30) => void;
  trendData: { date: string, count: number }[];
  topTags: [string, number][];
  activeTimeSlot: { label: string, count: number, percentage: string };
  heatmapData: { data: number[][], weeks: number };
  getHeatColor: (value: number) => string;
  heatLegendRanges: string[];
}

function StatsViewA({
  getTotalNotes,
  getStreak,
  getThisWeekNotes,
  getTodayNotes,
  getThisMonthNotes,
  getAvgNotesPerDay,
  getRecordingDays,
  trendPeriod,
  setTrendPeriod,
  trendData,
  topTags,
  activeTimeSlot,
  heatmapData,
  getHeatColor,
  heatLegendRanges,
}: StatsViewAProps) {
  return (
    <div className="flex-1 px-3 sm:px-4 py-4 pb-24">
      {/* 横向核心数据条 - Notion风格 */}
      <div className="bg-white rounded-xl p-3 sm:p-4 mb-3 border border-border">
        <div className="grid grid-cols-3 divide-x divide-border">
          <div className="text-center px-2">
            <div className="text-lg sm:text-xl font-semibold mb-0.5">{getStreak()}</div>
            <div className="text-xs text-muted-foreground">连续天数</div>
          </div>
          <div className="text-center px-2">
            <div className="text-lg sm:text-xl font-semibold mb-0.5">{getThisWeekNotes()}</div>
            <div className="text-xs text-muted-foreground">本周笔记</div>
          </div>
          <div className="text-center px-2">
            <div className="text-lg sm:text-xl font-semibold mb-0.5">{getTotalNotes()}</div>
            <div className="text-xs text-muted-foreground">总笔记数</div>
          </div>
        </div>
      </div>

      {/* 次要数据网格 */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        <div className="bg-white rounded-lg p-2.5 border border-border text-center">
          <div className="text-base font-semibold mb-0.5">{getTodayNotes()}</div>
          <div className="text-xs text-muted-foreground">今日</div>
        </div>
        <div className="bg-white rounded-lg p-2.5 border border-border text-center">
          <div className="text-base font-semibold mb-0.5">{getThisMonthNotes()}</div>
          <div className="text-xs text-muted-foreground">本月</div>
        </div>
        <div className="bg-white rounded-lg p-2.5 border border-border text-center">
          <div className="text-base font-semibold mb-0.5">{getAvgNotesPerDay()}</div>
          <div className="text-xs text-muted-foreground">日均</div>
        </div>
        <div className="bg-white rounded-lg p-2.5 border border-border text-center">
          <div className="text-base font-semibold mb-0.5">{getRecordingDays()}</div>
          <div className="text-xs text-muted-foreground">总天数</div>
        </div>
      </div>

      {/* 记录热力图 - 移到这里，在趋势图之前 */}
      <div className="bg-white rounded-xl p-3 mb-3 border border-border">
        <h2 className="text-base font-medium mb-3">
          记录热力图（{heatmapData.weeks}周）
        </h2>
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-1" style={{ minWidth: '280px' }}>
            {/* 星期标签 */}
            <div className="flex flex-col gap-0.5 pr-1.5">
              <div className="h-2.5 text-[10px] text-muted-foreground flex items-center"></div>
              {['一', '二', '三', '四', '五', '六', '日'].map((day, i) => (
                <div key={i} className="h-2.5 text-[10px] text-muted-foreground flex items-center">
                  {day}
                </div>
              ))}
            </div>
            {/* 热力图格子 */}
            <div className="flex gap-0.5 flex-1">
              {heatmapData.data.length > 0 && heatmapData.data[0].map((_, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-0.5 flex-1">
                  {heatmapData.data.map((week, dayIndex) => (
                    <div
                      key={`${weekIndex}-${dayIndex}`}
                      className={`h-2.5 rounded-sm ${getHeatColor(week[weekIndex])}`}
                      title={`${week[weekIndex]} 条笔记`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3 text-[10px] text-muted-foreground">
          <span>少</span>
          <div className="flex gap-0.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-muted" />
            <div className="w-2.5 h-2.5 rounded-sm bg-primary/15" />
            <div className="w-2.5 h-2.5 rounded-sm bg-primary/35" />
            <div className="w-2.5 h-2.5 rounded-sm bg-primary/60" />
            <div className="w-2.5 h-2.5 rounded-sm bg-primary/90" />
          </div>
          <span>多</span>
        </div>
        <div className="flex items-center gap-2 mt-3 text-[10px] text-muted-foreground">
          {heatLegendRanges.map((range, index) => (
            <span key={index}>{range}</span>
          ))}
        </div>
      </div>

      {/* 记录趋势 */}
      <div className="bg-white rounded-2xl p-5 mb-4 border border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-medium">记录趋势</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setTrendPeriod(7)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                trendPeriod === 7 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-accent text-accent-foreground hover:bg-accent/70'
              }`}
            >
              7天
            </button>
            <button
              onClick={() => setTrendPeriod(30)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                trendPeriod === 30 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-accent text-accent-foreground hover:bg-accent/70'
              }`}
            >
              30天
            </button>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={trendData}>
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12, fill: '#999' }}
              tickLine={false}
              axisLine={{ stroke: '#E5E5E5' }}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#999' }}
              tickLine={false}
              axisLine={{ stroke: '#E5E5E5' }}
              allowDecimals={false}
            />
            <Tooltip 
              contentStyle={{ 
                background: 'white', 
                border: '1px solid #E5E5E5',
                borderRadius: '8px',
                fontSize: '12px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="count" 
              stroke="#37352F" 
              strokeWidth={2}
              dot={{ fill: '#37352F', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 习惯分析 - 横向并列 */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* 最活跃时段 */}
        <div className="bg-white rounded-2xl p-4 border border-border">
          <h3 className="text-sm font-medium mb-3">最活跃时段</h3>
          <div className="text-center">
            <div className="text-2xl mb-1">{activeTimeSlot.label.includes('上午') ? '🌅' : activeTimeSlot.label.includes('下午') ? '☀️' : '🌙'}</div>
            <div className="text-sm font-medium mb-0.5">{activeTimeSlot.label.split(' ')[0]}</div>
            <div className="text-xs text-muted-foreground">{activeTimeSlot.count} 条 ({activeTimeSlot.percentage}%)</div>
          </div>
        </div>

        {/* TOP1标签 */}
        <div className="bg-white rounded-2xl p-4 border border-border">
          <h3 className="text-sm font-medium mb-3">最常用标签</h3>
          {topTags.length > 0 ? (
            <div className="text-center">
              <div className="text-2xl mb-1">🏷️</div>
              <div className="text-sm font-medium mb-0.5">#{topTags[0][0]}</div>
              <div className="text-xs text-muted-foreground">{topTags[0][1]} 次</div>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground text-center py-2">暂无数据</p>
          )}
        </div>
      </div>

      {/* 标签排行 */}
      <div className="bg-white rounded-2xl p-5 mb-4 border border-border">
        <h2 className="text-base font-medium mb-4">标签排行 TOP 5</h2>
        {topTags.length > 0 ? (
          <div className="space-y-2.5">
            {topTags.map(([tag, count], index) => (
              <div key={tag} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">#{tag}</span>
                    <span className="text-xs text-muted-foreground">{count}</span>
                  </div>
                  <div className="h-1 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${(count / topTags[0][1]) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">暂无标签数据</p>
        )}
      </div>
    </div>
  );
}