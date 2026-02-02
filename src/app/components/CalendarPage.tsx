import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, X } from 'lucide-react';
import { Note, NoteCard } from './NoteCard';

interface CalendarPageProps {
  notes: Note[];
  onNoteDelete: (id: string) => void;
  onNoteUpdate: (id: string, content: string, tags: string[]) => void;
  onBackToList?: () => void;
}

export function CalendarPage({ notes, onNoteDelete, onNoteUpdate, onBackToList }: CalendarPageProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date()); // 默认选中今天

  // 获取当月的所有日期
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // 获取第一天是星期几（0=周日，调整为1=周一）
    let firstDayOfWeek = firstDay.getDay();
    firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    
    const days: (Date | null)[] = [];
    
    // 填充前面的空白
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }
    
    // 填充当月日期
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  // 获取某一天的笔记
  const getNotesForDate = (date: Date) => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    return notes.filter(note => 
      note.timestamp >= startOfDay.getTime() && 
      note.timestamp <= endOfDay.getTime()
    );
  };

  // 切换月份
  const changeMonth = (delta: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + delta);
    setCurrentDate(newDate);
  };

  // 回到今天
  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  // 判断是否是今天
  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  // 判断是否是选中的日期
  const isSelected = (date: Date | null) => {
    if (!date || !selectedDate) return false;
    return date.getDate() === selectedDate.getDate() &&
           date.getMonth() === selectedDate.getMonth() &&
           date.getFullYear() === selectedDate.getFullYear();
  };

  // 判断是否是未来日期
  const isFuture = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date.getTime() > today.getTime();
  };

  const days = getDaysInMonth(currentDate);
  const selectedNotes = selectedDate ? getNotesForDate(selectedDate) : [];

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between h-14 px-4 border-b border-border bg-white relative">
        {onBackToList && (
          <button
            onClick={onBackToList}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-accent transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        <h1 className="text-base absolute left-1/2 -translate-x-1/2">记录日历</h1>
        <div className="w-8" />
      </div>

      {/* Calendar Controls */}
      <div className="bg-white border-b border-border px-4 py-2">
        <div className="flex items-center justify-between">
          <button
            onClick={() => changeMonth(-1)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-accent transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-medium">
              {currentDate.getFullYear()}年 {currentDate.getMonth() + 1}月
            </h2>
            <button
              onClick={goToToday}
              className="px-2 py-0.5 text-xs bg-accent hover:bg-accent/70 rounded transition-colors"
            >
              今天
            </button>
          </div>
          
          <button
            onClick={() => changeMonth(1)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-accent transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Calendar Section - 固定高度 */}
      <div className="bg-white px-3 sm:px-4 py-2 sm:py-3 border-b border-border">
        {/* Week Headers */}
        <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-1">
          {['一', '二', '三', '四', '五', '六', '日'].map((day) => (
            <div key={day} className="text-center text-xs text-muted-foreground py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
          {days.map((date, index) => {
            if (!date) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const dayNotes = getNotesForDate(date);
            const hasNotes = dayNotes.length > 0;
            const today = isToday(date);
            const selected = isSelected(date);
            const future = isFuture(date);

            return (
              <button
                key={date.toISOString()}
                onClick={() => !future && setSelectedDate(date)}
                disabled={future}
                className={`
                  aspect-square rounded-md flex flex-col items-center justify-center transition-all relative
                  ${selected ? 'bg-primary/10 border-2 border-primary' : today ? 'border-2 border-primary/30 bg-white' : 'border border-border bg-white'}
                  ${future ? 'cursor-not-allowed' : 'hover:bg-accent'}
                `}
              >
                <span className={`
                  text-xs sm:text-sm
                  ${selected ? 'font-semibold text-primary' : today ? 'font-semibold text-primary/70' : ''}
                  ${future ? 'text-muted-foreground/30' : 'text-foreground'}
                `}>
                  {date.getDate()}
                </span>
                {hasNotes && !future && (
                  <div className="w-1 h-1 bg-primary rounded-full mt-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Notes Review Section - 占据剩余空间 */}
      <div className="flex-1 flex flex-col bg-background overflow-hidden">
        <div className="px-4 py-2.5 sm:py-3 bg-white border-b border-border">
          <h3 className="text-sm font-medium text-foreground">
            {selectedDate.getMonth() + 1}月{selectedDate.getDate()}日
            {isToday(selectedDate) && <span className="ml-2 text-xs text-primary">今天</span>}
            <span className="ml-2 text-xs text-muted-foreground">
              {selectedNotes.length} 条笔记
            </span>
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3 sm:py-4 pb-20">
          {selectedNotes.length > 0 ? (
            <div className="space-y-2 sm:space-y-3">
              {selectedNotes
                .sort((a, b) => b.timestamp - a.timestamp)
                .map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onDelete={onNoteDelete}
                    onEdit={onNoteUpdate}
                    onTagClick={() => {}}
                  />
                ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <CalendarIcon className="w-10 h-10 mb-2 opacity-50" />
              <p className="text-sm">这天还没有笔记</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}