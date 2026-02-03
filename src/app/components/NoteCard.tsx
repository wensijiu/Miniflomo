import { Trash2, MoreVertical, Pencil, Send, Star } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export interface Note {
  id: string;
  content: string;
  tags: string[];
  timestamp: number;
}

interface NoteCardProps {
  note: Note;
  onDelete: (id: string) => void;
  onEdit: (id: string, content: string, tags: string[]) => void;
  onTagClick?: (tag: string) => void;
  recentTags?: string[];
  frequentTags?: string[];
}

export function NoteCard({ note, onDelete, onEdit, onTagClick, recentTags = [], frequentTags = [] }: NoteCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isFullScreenEdit, setIsFullScreenEdit] = useState(false);
  const [editContent, setEditContent] = useState(note.content);
  const [editTags, setEditTags] = useState<string[]>(note.tags);
  const [tagInput, setTagInput] = useState('');
  const [tagView, setTagView] = useState<'frequent' | 'recent'>('frequent');
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current && isFullScreenEdit) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [editContent, isFullScreenEdit]);

  const handleEdit = () => {
    setMenuOpen(false);
    setIsFullScreenEdit(true);
    setEditContent(note.content);
    setEditTags(note.tags);
    setTagInput('');
  };

  const handleDoubleClick = () => {
    setIsFullScreenEdit(true);
    setEditContent(note.content);
    setEditTags(note.tags);
    setTagInput('');
  };

  const handleSaveFullScreenEdit = () => {
    if (editContent.trim()) {
      onEdit(note.id, editContent.trim(), editTags);
      setIsFullScreenEdit(false);
    }
  };

  const handleCancelFullScreenEdit = () => {
    setIsFullScreenEdit(false);
    setEditContent(note.content);
    setEditTags(note.tags);
    setTagInput('');
  };

  const handleAddTag = (tag: string) => {
    const trimmedTag = tag.trim().replace(/^#/, '');
    if (trimmedTag && !editTags.includes(trimmedTag)) {
      setEditTags([...editTags, trimmedTag]);
      setTagInput('');
    }
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag(tagInput);
    } else if (e.key === 'Backspace' && tagInput === '' && editTags.length > 0) {
      setEditTags(editTags.slice(0, -1));
    }
  };

  const toggleTag = (tag: string) => {
    if (editTags.includes(tag)) {
      setEditTags(editTags.filter(t => t !== tag));
    } else {
      setEditTags([...editTags, tag]);
    }
  };

  const getDisplayTagLimit = (tagList: string[]) => {
    if (tagList.length === 0) return 0;
    const avgLength = tagList.slice(0, 8).reduce((sum, tag) => sum + tag.length, 0) / Math.min(8, tagList.length);
    if (avgLength <= 3) {
      return 4;
    } else {
      return 3;
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return `今天 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    } else if (days === 1) {
      return '昨天';
    } else if (days < 7) {
      return `${days} 天前`;
    } else {
      return `${date.getMonth() + 1}${date.getDate()}日`;
    }
  };

  // Handle touch for swipe to delete
  const handleTouchStart = (e: React.TouchEvent) => {
    // If already showing delete button, don't allow swiping
    if (swipeOffset > 0) {
      return;
    }
    
    const startX = e.touches[0].clientX;
    let lastDiff = 0;

    const handleTouchMove = (moveEvent: TouchEvent) => {
      const currentX = moveEvent.touches[0].clientX;
      const diff = startX - currentX;
      
      // Allow swipe up to 100px
      if (diff > 0 && diff <= 100) {
        lastDiff = diff;
        setSwipeOffset(diff);
      }
    };

    const handleTouchEnd = () => {
      // If swiped more than 50px, lock at 80px to show delete button
      if (lastDiff > 50) {
        setSwipeOffset(80);
      } else {
        // Otherwise, reset
        setSwipeOffset(0);
      }
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };

  // Close delete button when clicking outside
  const handleCardClick = (e: React.MouseEvent | React.TouchEvent) => {
    if (swipeOffset > 0) {
      e.stopPropagation();
      setSwipeOffset(0);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (window.confirm('确定要删除这条笔记吗？')) {
      onDelete(note.id);
    } else {
      setSwipeOffset(0);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setSwipeOffset(0);
  };

  return (
    <div className="relative overflow-hidden">      
      {/* Delete Button Background - Must be above backdrop */}
      {swipeOffset > 0 && (
        <button
          onClick={handleDeleteClick}
          onTouchEnd={(e) => {
            e.stopPropagation();
            e.preventDefault();
            handleDeleteClick(e as any);
          }}
          className="absolute right-0 top-0 bottom-0 w-20 bg-destructive flex items-center justify-center rounded-r-2xl z-50"
        >
          <Trash2 className="w-5 h-5 text-white" />
        </button>
      )}
      
      {/* Backdrop for closing swipe - Below delete button */}
      {swipeOffset > 0 && (
        <div
          className="fixed inset-0 z-40"
          onClick={handleBackdropClick}
          onTouchEnd={handleBackdropClick}
        />
      )}

      <div 
        ref={cardRef}
        className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm group cursor-pointer transition-transform relative z-45"
        style={{ 
          transform: `translateX(-${swipeOffset}px)`,
          transition: swipeOffset === 0 ? 'transform 0.3s ease' : 'none'
        }}
        onTouchStart={handleTouchStart}
        onDoubleClick={handleDoubleClick}
        onClick={handleCardClick}
      >
        {/* Menu Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen(!menuOpen);
          }}
          className="absolute top-2 sm:top-3 right-2 sm:right-3 p-1.5 rounded hover:bg-accent transition-colors opacity-0 group-hover:opacity-100"
        >
          <MoreVertical className="w-4 h-4 text-muted-foreground" />
        </button>

        {/* Dropdown Menu */}
        {menuOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setMenuOpen(false)}
            />
            
            {/* Menu */}
            <div className="absolute right-2 sm:right-3 top-10 sm:top-12 bg-white rounded-lg shadow-lg border border-border z-50 overflow-hidden min-w-[100px]">
              <button
                onClick={handleEdit}
                className="w-full px-4 py-3 flex items-center gap-2 hover:bg-accent transition-colors text-left text-sm border-b border-border"
              >
                <Pencil className="w-4 h-4 text-muted-foreground" />
                <span>编辑</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm('确定要删除这条笔记吗？')) {
                    onDelete(note.id);
                  }
                  setMenuOpen(false);
                }}
                className="w-full px-4 py-3 flex items-center gap-2 hover:bg-accent transition-colors text-left text-sm"
              >
                <Trash2 className="w-4 h-4 text-muted-foreground" />
                <span>删除</span>
              </button>
            </div>
          </>
        )}

        <p className="text-sm sm:text-base leading-normal sm:leading-relaxed mb-2 sm:mb-3 whitespace-pre-wrap pr-8">{note.content}</p>
        
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {note.tags.map((tag, index) => (
              <span 
                key={index} 
                className="text-xs sm:text-sm text-muted-foreground cursor-pointer hover:text-primary transition-colors" 
                onClick={(e) => {
                  e.stopPropagation();
                  onTagClick?.(tag);
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap">{formatDate(note.timestamp)}</span>
        </div>
      </div>

      {/* Full Screen Edit Modal */}
      {isFullScreenEdit && (
        <div className="fixed inset-0 bg-background z-[60]">
          <div className="h-screen flex flex-col max-w-lg mx-auto">
            {/* Header */}
            <div className="flex items-center justify-center h-14 border-b border-border bg-white relative">
              <h1 className="text-base">编辑笔记</h1>
              <button
                onClick={handleCancelFullScreenEdit}
                className="absolute left-4 text-sm text-muted-foreground hover:text-foreground"
              >
                取消
              </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex items-center justify-center px-6">
              <textarea
                ref={textareaRef}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="记录此刻的想法..."
                className="w-full max-h-[60vh] resize-none border-none outline-none text-foreground placeholder:text-muted-foreground bg-transparent text-center overflow-hidden"
                rows={1}
                autoFocus
              />
            </div>

            {/* Selected Tags Display */}
            {editTags.length > 0 && (
              <div className="px-6 pb-3">
                <div className="flex flex-wrap gap-2 justify-center">
                  {editTags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      #{tag}
                      <button
                        onClick={() => setEditTags(editTags.filter((_, i) => i !== index))}
                        className="hover:text-primary/70"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Tags Selection */}
            <div className="bg-white border-t border-border">
              {/* Tab Switcher */}
              <div className="flex items-center justify-between px-6 py-3 border-b border-border">
                <div className="flex gap-2">
                  <button
                    onClick={() => setTagView('frequent')}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      tagView === 'frequent'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-accent'
                    }`}
                  >
                    常用
                  </button>
                  <button
                    onClick={() => setTagView('recent')}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      tagView === 'recent'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-accent'
                    }`}
                  >
                    最近
                  </button>
                </div>
              </div>

              {/* Tags Grid */}
              {((tagView === 'frequent' && frequentTags.length > 0) || (tagView === 'recent' && recentTags.length > 0)) ? (
                <div className="px-6 py-3 overflow-x-auto">
                  <div className="flex flex-wrap gap-2">
                    {(tagView === 'frequent' ? frequentTags : recentTags).slice(0, getDisplayTagLimit(tagView === 'frequent' ? frequentTags : recentTags)).map((tag, index) => (
                      <button
                        key={index}
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                          editTags.includes(tag)
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'bg-accent text-accent-foreground hover:bg-accent/70'
                        }`}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="px-6 py-4 text-center text-sm text-muted-foreground">
                  暂无{tagView === 'frequent' ? '常用' : '最近'}标签
                </div>
              )}

              {/* Manual Tag Input */}
              <div className="px-6 py-3 border-t border-border">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">#</span>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagInputKeyDown}
                    placeholder="或手动输入标签..."
                    className="flex-1 border-none outline-none text-foreground placeholder:text-muted-foreground bg-transparent text-sm"
                  />
                  {tagInput && (
                    <button
                      onClick={() => handleAddTag(tagInput)}
                      className="text-primary text-sm hover:text-primary/70"
                    >
                      添加
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="px-6 py-4 bg-white">
              <button
                onClick={handleSaveFullScreenEdit}
                disabled={!editContent.trim()}
                className="w-full h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
              >
                <Send className="w-5 h-5" />
                <span>保存</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}