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
  const [heatmapPeriod, setHeatmapPeriod] = useState<'week' | 'month' | 'quarter'>('week');

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

  // 热力图数据（本周/本月/本季度，不同展示方式）
  const getHeatmapData = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0=周日, 1=周一, ..., 6=周六
    const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    
    if (heatmapPeriod === 'week') {
      // 本周：返回7天的数据（周一到周日），用于进度条展示
      const thisMonday = new Date(today);
      thisMonday.setDate(today.getDate() - daysFromMonday);
      thisMonday.setHours(0, 0, 0, 0);
      
      const weekData = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(thisMonday);
        date.setDate(thisMonday.getDate() + i);
        const dayStart = date.getTime();
        const dayEnd = dayStart + 24 * 60 * 60 * 1000;
        
        const count = notes.filter(
          note => note.timestamp >= dayStart && note.timestamp < dayEnd
        ).length;
        
        const dayNames = ['一', '二', '三', '四', '五', '六', '日'];
        const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
        
        weekData.push({
          day: dayNames[i],
          date: dateStr,
          count,
          isToday: date.toDateString() === today.toDateString(),
          isFuture: date > today,
        });
      }
      
      return { type: 'week', weekData };
    } else if (heatmapPeriod === 'month') {
      // 本月：返回整月的日历数据（横向7列网格布局）
      const year = today.getFullYear();
      const month = today.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate(); // 当月天数
      
      // 找到本月1号是星期几
      const firstDay = new Date(year, month, 1);
      const firstDayOfWeek = firstDay.getDay();
      const firstDayIndex = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1; // 周一=0, 周日=6
      
      // 计算需要多少周（向上取整）
      const totalCells = firstDayIndex + daysInMonth;
      const weeks = Math.ceil(totalCells / 7);
      
      // 创建日历数据：每周一个数组，每天一个对象
      const calendarData = [];
      
      for (let week = 0; week < weeks; week++) {
        const weekData = [];
        for (let day = 0; day < 7; day++) {
          const cellIndex = week * 7 + day;
          const dayOfMonth = cellIndex - firstDayIndex + 1;
          
          if (dayOfMonth >= 1 && dayOfMonth <= daysInMonth) {
            // 属于本月的日期
            const date = new Date(year, month, dayOfMonth);
            const dayStart = date.getTime();
            const dayEnd = dayStart + 24 * 60 * 60 * 1000;
            
            const count = notes.filter(
              note => note.timestamp >= dayStart && note.timestamp < dayEnd
            ).length;
            
            const isToday = date.toDateString() === today.toDateString();
            
            weekData.push({
              date: dayOfMonth,
              count,
              isToday,
              isEmpty: false,
            });
            
            console.log(`📊 本月日历：${dayOfMonth}日 (${['一','二','三','四','五','六','日'][day]}) → ${count}条`);
          } else {
            // 空格
            weekData.push({
              date: 0,
              count: 0,
              isToday: false,
              isEmpty: true,
            });
          }
        }
        calendarData.push(weekData);
      }
      
      return { type: 'month', calendarData, weeks };
    } else {
      // 本季度：纵向热力图（保持原有逻辑）
      const thisMonday = new Date(today);
      thisMonday.setDate(today.getDate() - daysFromMonday);
      thisMonday.setHours(0, 0, 0, 0);
      
      // 本季度第一天所在的周一
      const quarterStartMonth = Math.floor(today.getMonth() / 3) * 3;
      const quarterStart = new Date(today.getFullYear(), quarterStartMonth, 1);
      const quarterStartDayOfWeek = quarterStart.getDay();
      const quarterStartDaysFromMonday = quarterStartDayOfWeek === 0 ? 6 : quarterStartDayOfWeek - 1;
      
      const startMonday = new Date(quarterStart);
      startMonday.setDate(quarterStart.getDate() - quarterStartDaysFromMonday);
      startMonday.setHours(0, 0, 0, 0);
      
      // 本周日 23:59:59
      const thisSunday = new Date(thisMonday);
      thisSunday.setDate(thisMonday.getDate() + 6);
      thisSunday.setHours(23, 59, 59, 999);
      
      // 计算周数
      const diffTime = thisMonday.getTime() - startMonday.getTime();
      const diffWeeks = Math.floor(diffTime / (7 * 24 * 60 * 60 * 1000));
      const weeks = diffWeeks + 1;
      
      console.log(`📊 本季度热力图范围：${startMonday.toLocaleDateString()} ~ ${thisSunday.toLocaleDateString()}，共${weeks}周`);
      
      // 初始化数据数组
      const data: number[][] = Array(7).fill(0).map(() => Array(weeks).fill(0));
      
      notes.forEach(note => {
        const noteDate = new Date(note.timestamp);
        noteDate.setHours(0, 0, 0, 0);
        
        if (noteDate.getTime() < startMonday.getTime() || noteDate.getTime() > thisSunday.getTime()) {
          return;
        }
        
        const diffTime = noteDate.getTime() - startMonday.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const weekIndex = Math.floor(diffDays / 7);
        const noteDayOfWeek = noteDate.getDay();
        const dayIndex = noteDayOfWeek === 0 ? 6 : noteDayOfWeek - 1;
        
        if (weekIndex >= 0 && weekIndex < weeks && dayIndex >= 0 && dayIndex < 7) {
          data[dayIndex][weekIndex]++;
        }
      });
      
      return { type: 'quarter', data, weeks };
    }
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
      <div className="flex items-center justify-between h-14 px-4 border-b border-border bg-white relative pt-safe">
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-accent transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <h1 className="text-base absolute left-1/2 -translate-x-1/2 whitespace-nowrap">数据统计</h1>
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
          heatmapPeriod={heatmapPeriod}
          setHeatmapPeriod={setHeatmapPeriod}
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
  heatmapData: any;
  heatmapPeriod: 'week' | 'month' | 'quarter';
  setHeatmapPeriod: (period: 'week' | 'month' | 'quarter') => void;
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
  heatmapPeriod,
  setHeatmapPeriod,
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
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-medium">记录热力图</h2>
          <div className="flex gap-1.5">
            <button
              onClick={() => setHeatmapPeriod('week')}
              className={`px-2.5 py-1 rounded-full text-xs transition-colors ${
                heatmapPeriod === 'week' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-accent text-accent-foreground hover:bg-accent/70'
              }`}
            >
              本周
            </button>
            <button
              onClick={() => setHeatmapPeriod('month')}
              className={`px-2.5 py-1 rounded-full text-xs transition-colors ${
                heatmapPeriod === 'month' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-accent text-accent-foreground hover:bg-accent/70'
              }`}
            >
              本月
            </button>
            <button
              onClick={() => setHeatmapPeriod('quarter')}
              className={`px-2.5 py-1 rounded-full text-xs transition-colors ${
                heatmapPeriod === 'quarter' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-accent text-accent-foreground hover:bg-accent/70'
              }`}
            >
              本季度
            </button>
          </div>
        </div>

        {/* 本周：垂直进度条 */}
        {heatmapData.type === 'week' && heatmapData.weekData && (
          <div className="space-y-0.5">
            {heatmapData.weekData.map((item, index) => {
              const maxCount = Math.max(...heatmapData.weekData!.map(d => d.count), 1);
              const percentage = (item.count / maxCount) * 100;
              
              return (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-7 text-[10px] text-muted-foreground">
                    {item.day}
                  </div>
                  <div className="w-14 text-[10px] text-muted-foreground">
                    {item.date}
                  </div>
                  <div className="flex-1 h-5 bg-muted rounded-full overflow-hidden relative">
                    <div
                      className={`h-full rounded-full transition-all ${
                        item.count === 0 
                          ? 'bg-muted' 
                          : item.isToday
                          ? 'bg-primary/90'
                          : 'bg-primary/60'
                      }`}
                      style={{ width: `${Math.max(percentage, item.count > 0 ? 8 : 0)}%` }}
                    />
                  </div>
                  <div className={`w-7 text-[10px] text-right font-medium ${
                    item.isToday ? 'text-primary' : 'text-foreground'
                  }`}>
                    {item.count}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 本月：横向7列网格布局 */}
        {heatmapData.type === 'month' && heatmapData.calendarData && (
          <div>
            {/* 星期标签行 */}
            <div className="grid grid-cols-7 gap-0.5 mb-1.5">
              {['一', '二', '三', '四', '五', '六', '日'].map((day, i) => (
                <div key={i} className="text-center text-[10px] text-muted-foreground font-medium">
                  {day}
                </div>
              ))}
            </div>
            
            {/* 日历网格 */}
            <div className="space-y-0.5">
              {heatmapData.calendarData.map((week, weekIndex) => (
                <div key={weekIndex} className="grid grid-cols-7 gap-0.5">
                  {week.map((day, dayIndex) => (
                    <div
                      key={`${weekIndex}-${dayIndex}`}
                      className={`h-6 rounded flex flex-col items-center justify-center text-[10px] transition-all ${
                        day.isEmpty
                          ? 'bg-transparent'
                          : day.isToday
                          ? `${getHeatColor(day.count)} ring-1 ring-primary`
                          : getHeatColor(day.count)
                      }`}
                    >
                      {!day.isEmpty && (
                        <>
                          <div className={`font-medium leading-none ${day.isToday ? 'text-primary' : 'text-foreground'}`}>
                            {day.date}
                          </div>
                          {day.count > 0 && (
                            <div className="text-[8px] text-muted-foreground leading-none mt-0.5">
                              {day.count}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 本季度：纵向热力图 */}
        {heatmapData.type === 'quarter' && heatmapData.data && (
          <div className="overflow-x-auto pb-2">
            <div className="flex gap-1.5" style={{ minWidth: '280px' }}>
              {/* 星期标签 */}
              <div className="flex flex-col gap-0.5 justify-start pt-3">
                {['一', '二', '三', '四', '五', '六', '日'].map((day, i) => (
                  <div key={i} className="h-3 text-[10px] text-muted-foreground flex items-center leading-none">
                    {day}
                  </div>
                ))}
              </div>
              {/* 热力图格子 */}
              <div className="flex gap-0.5 flex-1">
                {heatmapData.data.length > 0 && heatmapData.data[0].map((_, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-0.5 flex-1">
                    {/* 周标签（可选） */}
                    <div className="h-3 text-[9px] text-muted-foreground text-center leading-none mb-0.5">
                      {weekIndex === heatmapData.weeks! - 1 ? '本周' : ''}
                    </div>
                    {heatmapData.data!.map((week, dayIndex) => (
                      <div
                        key={`${weekIndex}-${dayIndex}`}
                        className={`h-3 rounded-sm ${getHeatColor(week[weekIndex])}`}
                        title={`${week[weekIndex]} 条笔记`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 图例 - 只在本月和本季度显示 */}
        {(heatmapData.type === 'month' || heatmapData.type === 'quarter') && (
          <>
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
            <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground">
              {heatLegendRanges.map((range, index) => (
                <span key={index}>{range}</span>
              ))}
            </div>
          </>
        )}
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
            
            {/* 总计 */}
            <div className="flex items-center gap-3 pt-2 mt-2 border-t border-border">
              <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center text-xs font-medium">
                ∑
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">总计</span>
                  <span className="text-xs text-muted-foreground">
                    {topTags.reduce((sum, [, count]) => sum + count, 0)} 次
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">暂无标签数据</p>
        )}
      </div>
    </div>
  );
}