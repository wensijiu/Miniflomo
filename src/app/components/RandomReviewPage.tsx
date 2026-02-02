import { useState, useEffect } from 'react';
import { RefreshCw, Share2, X } from 'lucide-react';
import { Note } from './NoteCard';
import { motion, AnimatePresence, PanInfo } from 'motion/react';

interface RandomReviewPageProps {
  notes: Note[];
  onClose?: () => void;
}

export function RandomReviewPage({ notes, onClose }: RandomReviewPageProps) {
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    if (notes.length > 0) {
      const randomIndex = Math.floor(Math.random() * notes.length);
      setCurrentNote(notes[randomIndex]);
    }
  }, [notes]);

  const getRandomNote = () => {
    if (notes.length > 0) {
      const randomIndex = Math.floor(Math.random() * notes.length);
      return notes[randomIndex];
    }
    return null;
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentNote(getRandomNote());
  };

  const handlePrevious = () => {
    setDirection(-1);
    setCurrentNote(getRandomNote());
  };

  const handleDragEnd = (e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 50;
    
    if (Math.abs(info.offset.x) > swipeThreshold) {
      if (info.offset.x > 0) {
        // Swiped right
        handlePrevious();
      } else {
        // Swiped left
        handleNext();
      }
    }
  };

  const getDaysAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return '今天';
    if (days === 1) return '昨天';
    if (days < 7) return `${days} 天前`;
    if (days < 30) return `${Math.floor(days / 7)} 周前`;
    if (days < 365) return `${Math.floor(days / 30)} 个月前`;
    return `${Math.floor(days / 365)} 年前`;
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
  };

  if (notes.length === 0) {
    return (
      <div className="flex flex-col h-full bg-background">
        <div className="flex items-center justify-center h-14 border-b border-border bg-white">
          <h1 className="text-base">随机回顾</h1>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground px-6">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <RefreshCw className="w-8 h-8" />
          </div>
          <p>还没有笔记可以回顾</p>
          <p className="text-sm mt-2">先去记录一些想法吧</p>
        </div>
      </div>
    );
  }

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      rotateY: direction > 0 ? 45 : -45,
    }),
    center: {
      x: 0,
      opacity: 1,
      rotateY: 0,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
      rotateY: direction > 0 ? -45 : 45,
    }),
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <div className="flex items-center justify-between h-14 px-4 border-b border-border bg-white/80 backdrop-blur-sm relative">
        {onClose && (
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-accent transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        <h1 className="text-base absolute left-1/2 -translate-x-1/2">随机回顾</h1>
        <div className="w-8" />
      </div>

      {/* Main Card Area */}
      <div className="flex-1 flex items-center justify-center px-4 py-4 sm:px-6 sm:py-8 pb-24 overflow-hidden">
        <div className="w-full max-w-md relative" style={{ perspective: '1000px' }}>
          <AnimatePresence mode="wait" custom={direction}>
            {currentNote && (
              <motion.div
                key={currentNote.id}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.7}
                onDragEnd={handleDragEnd}
                transition={{
                  x: { type: 'spring', stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                  rotateY: { duration: 0.2 },
                }}
                className="w-full cursor-grab active:cursor-grabbing"
              >
                <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xl border border-border/50">
                  {/* Content */}
                  <div className="mb-4 sm:mb-8">
                    <p className="text-sm sm:text-lg leading-normal sm:leading-relaxed text-foreground whitespace-pre-wrap">
                      {currentNote.content}
                    </p>
                  </div>
                  
                  {/* Tags */}
                  {currentNote.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 justify-center mb-3 sm:mb-6 pb-3 sm:pb-6 border-b border-border">
                      {currentNote.tags.map((tag, index) => (
                        <span 
                          key={index} 
                          className="px-2.5 py-1 sm:px-3 bg-accent/80 text-accent-foreground rounded-full text-xs sm:text-sm"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {/* Date Info */}
                  <div className="text-center space-y-1">
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      {formatDate(currentNote.timestamp)}
                    </div>
                    <div className="text-xs text-muted-foreground/70">
                      来自 {getDaysAgo(currentNote.timestamp)}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Swipe Hint */}
          <div className="absolute -bottom-4 sm:-bottom-6 left-0 right-0 text-center">
            <p className="text-xs text-muted-foreground">← 左右滑动切换 →</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 sm:px-6 pb-2 sm:pb-3">
        <div className="max-w-md mx-auto text-center">
          <p className="text-xs text-muted-foreground">
            已记录 {notes.length} 条笔记
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 sm:px-6 py-3 sm:py-4 bg-white/80 backdrop-blur-sm border-t border-border">
        <div className="flex gap-3 max-w-md mx-auto">
          <button
            onClick={handleNext}
            className="flex-1 h-11 sm:h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <RefreshCw className="w-5 h-5" />
            <span>换一个</span>
          </button>
          <button
            className="h-11 sm:h-12 w-11 sm:w-12 bg-accent text-accent-foreground rounded-full flex items-center justify-center transition-all active:scale-95 hover:bg-accent/70"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}