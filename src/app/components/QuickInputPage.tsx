import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface QuickInputPageProps {
  onAddNote: (content: string, tags: string[]) => void;
  recentTags: string[];
  frequentTags: string[];
}

export function QuickInputPage({ onAddNote, recentTags, frequentTags }: QuickInputPageProps) {
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [tagView, setTagView] = useState<'frequent' | 'recent'>('frequent');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [content]);

  const handleSubmit = () => {
    if (content.trim()) {
      onAddNote(content, tags);
      setContent('');
      setTags([]);
      setTagInput('');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }
  };

  const handleAddTag = (tag: string) => {
    const trimmedTag = tag.trim().replace(/^#/, '');
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag(tagInput);
    } else if (e.key === 'Backspace' && tagInput === '' && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  const toggleTag = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter(t => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };

  // Calculate how many tags to show based on average tag length
  const getDisplayTagLimit = (tagList: string[]) => {
    if (tagList.length === 0) return 0;
    
    const avgLength = tagList.slice(0, 8).reduce((sum, tag) => sum + tag.length, 0) / Math.min(8, tagList.length);
    
    // If average length is short (<=3 chars), show 4 tags
    // If medium (4-5 chars), show 3 tags
    // If long (>5 chars), show 3 tags
    if (avgLength <= 3) {
      return 4;
    } else {
      return 3;
    }
  };

  const displayTags = tagView === 'frequent' ? frequentTags : recentTags;
  const displayLimit = getDisplayTagLimit(displayTags);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-center h-14 border-b border-border bg-white sticky top-0 z-10">
        <h1 className="text-base font-medium">ria</h1>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="发生了什么？想到什么？记下来..."
          className="w-full max-h-[60vh] resize-none border-none outline-none text-sm sm:text-base text-foreground placeholder-muted-foreground bg-transparent text-center overflow-hidden"
          rows={1}
        />
      </div>

      {/* Selected Tags Display */}
      {tags.length > 0 && (
        <div className="px-4 sm:px-6 pb-3">
          <div className="flex flex-wrap gap-2 justify-center">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-xs sm:text-sm"
              >
                #{tag}
                <button
                  onClick={() => setTags(tags.filter((_, i) => i !== index))}
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
      {(frequentTags.length > 0 || recentTags.length > 0) && (
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
          {displayTags.length > 0 ? (
            <div className="px-6 py-3 overflow-x-auto">
              <div className="flex flex-wrap gap-2">
                {displayTags.slice(0, displayLimit).map((tag, index) => (
                  <button
                    key={index}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                      tags.includes(tag)
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
      )}

      {/* Manual Tag Input Only (when no tags exist) */}
      {frequentTags.length === 0 && recentTags.length === 0 && (
        <div className="bg-white border-t border-border">
          <div className="px-6 py-3">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">#</span>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
                placeholder="添加标签..."
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
      )}

      {/* Submit Button */}
      <div className="px-6 py-4 bg-white">
        <button
          onClick={handleSubmit}
          disabled={!content.trim()}
          className="w-full h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
        >
          <Send className="w-5 h-5" />
          <span>发送</span>
        </button>
      </div>

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-foreground text-background px-6 py-3 rounded-full shadow-lg z-50">
          已保存
        </div>
      )}
    </div>
  );
}