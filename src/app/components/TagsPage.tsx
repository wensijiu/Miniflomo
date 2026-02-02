import { Hash, ChevronRight, Search, SortDesc, SortAsc, Pencil, Trash2, MoreVertical } from 'lucide-react';
import { Note } from './NoteCard';
import { useState } from 'react';

interface TagsPageProps {
  notes: Note[];
  onTagClick: (tag: string) => void;
  onRenameTag: (oldTag: string, newTag: string) => void;
  onDeleteTag: (tag: string) => void;
}

type SortType = 'count' | 'name';

export function TagsPage({ notes, onTagClick, onRenameTag, onDeleteTag }: TagsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortType>('count');
  const [editingTag, setEditingTag] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [menuOpenTag, setMenuOpenTag] = useState<string | null>(null);

  // Calculate tag statistics
  const tagStats = notes.reduce((acc, note) => {
    note.tags.forEach(tag => {
      if (!acc[tag]) {
        acc[tag] = 0;
      }
      acc[tag]++;
    });
    return acc;
  }, {} as Record<string, number>);

  // Filter and sort tags
  let filteredTags = Object.entries(tagStats);
  
  // Apply search filter
  if (searchQuery.trim()) {
    filteredTags = filteredTags.filter(([tag]) => 
      tag.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  
  // Apply sorting
  if (sortBy === 'count') {
    filteredTags.sort((a, b) => b[1] - a[1]);
  } else {
    filteredTags.sort((a, b) => a[0].localeCompare(b[0]));
  }

  const handleEdit = (tag: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTag(tag);
    setEditValue(tag);
    setMenuOpenTag(null);
  };

  const handleSaveEdit = () => {
    if (editValue.trim() && editingTag && editValue !== editingTag) {
      onRenameTag(editingTag, editValue.trim());
    }
    setEditingTag(null);
    setEditValue('');
  };

  const handleCancelEdit = () => {
    setEditingTag(null);
    setEditValue('');
  };

  const handleDelete = (tag: string, count: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`确定要删除标签「${tag}」吗？\n这将影响 ${count} 条笔记。`)) {
      onDeleteTag(tag);
      setMenuOpenTag(null);
    }
  };

  const handleTouchStart = (tag: string, e: React.TouchEvent) => {
    const startX = e.touches[0].clientX;
    const element = e.currentTarget as HTMLElement;

    const handleTouchMove = (moveEvent: TouchEvent) => {
      const currentX = moveEvent.touches[0].clientX;
      const diff = startX - currentX;

      if (diff > 50) {
        setMenuOpenTag(tag);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      }
    };

    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-center h-14 border-b border-border bg-white sticky top-0 z-10">
        <h1 className="text-base font-medium">标签</h1>
      </div>

      {/* Search and Sort */}
      {Object.keys(tagStats).length > 0 && (
        <div className="bg-white border-b border-border">
          <div className="max-w-lg mx-auto px-4 sm:px-6 py-2.5 space-y-2.5">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="搜索标签..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-10 pr-4 bg-accent rounded-lg outline-none focus:ring-2 focus:ring-primary transition-shadow text-sm"
              />
            </div>

            {/* Sort Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setSortBy('count')}
                className={`flex-1 h-8 px-3 rounded-lg flex items-center justify-center gap-1.5 text-sm transition-colors ${
                  sortBy === 'count'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-accent text-accent-foreground hover:bg-accent/70'
                }`}
              >
                <SortDesc className="w-3.5 h-3.5" />
                <span className="text-xs">按使用次数</span>
              </button>
              <button
                onClick={() => setSortBy('name')}
                className={`flex-1 h-8 px-3 rounded-lg flex items-center justify-center gap-1.5 text-sm transition-colors ${
                  sortBy === 'name'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-accent text-accent-foreground hover:bg-accent/70'
                }`}
              >
                <SortAsc className="w-3.5 h-3.5" />
                <span className="text-xs">按名称</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tags List */}
      <div className="flex-1 overflow-y-auto pb-20">
        {Object.keys(tagStats).length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground px-6">
            <Hash className="w-12 h-12 mb-3 opacity-50" />
            <p>还没有标签</p>
            <p className="text-sm mt-2">在记录笔记时添加标签</p>
          </div>
        ) : filteredTags.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground px-6">
            <Search className="w-12 h-12 mb-3 opacity-50" />
            <p>没有找到匹配的标签</p>
            <p className="text-sm mt-2">试试其他关键词</p>
          </div>
        ) : (
          <div className="max-w-lg mx-auto">
            {/* Tag Count Summary */}
            <div className="px-6 py-2.5 bg-muted/30">
              <p className="text-xs text-muted-foreground">
                {searchQuery ? `找到 ${filteredTags.length} 个标签` : `共 ${filteredTags.length} 个标签`}
              </p>
            </div>

            {/* Tags List */}
            <div className="bg-white">
              {filteredTags.map(([tag, count], index) => (
                <div
                  key={tag}
                  className={`relative group ${
                    index !== filteredTags.length - 1 ? 'border-b border-border' : ''
                  }`}
                >
                  {/* Main Content */}
                  <div className="w-full flex items-center gap-3 px-6 py-3 hover:bg-accent/50 transition-colors">
                    <Hash className="w-4 h-4 text-primary flex-shrink-0" />
                    <button
                      onClick={() => onTagClick(tag)}
                      className="flex-1 min-w-0 text-left"
                    >
                      <h3 className="text-sm text-foreground truncate">{tag}</h3>
                    </button>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-muted-foreground">{count} 条</span>
                      
                      {/* More Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuOpenTag(menuOpenTag === tag ? null : tag);
                        }}
                        className="p-1 rounded hover:bg-accent transition-colors"
                      >
                        <MoreVertical className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  </div>

                  {/* Dropdown Menu */}
                  {menuOpenTag === tag && (
                    <>
                      {/* Backdrop */}
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setMenuOpenTag(null)}
                      />
                      
                      {/* Menu */}
                      <div className="absolute right-6 top-full mt-1 bg-white rounded-lg shadow-lg border border-border z-50 overflow-hidden min-w-[120px]">
                        <button
                          onClick={(e) => handleEdit(tag, e)}
                          className="w-full px-4 py-3 flex items-center gap-2 hover:bg-accent transition-colors text-left text-sm"
                        >
                          <Pencil className="w-4 h-4 text-muted-foreground" />
                          <span>编辑</span>
                        </button>
                        <button
                          onClick={(e) => handleDelete(tag, count, e)}
                          className="w-full px-4 py-3 flex items-center gap-2 hover:bg-accent transition-colors text-left text-sm border-t border-border"
                        >
                          <Trash2 className="w-4 h-4 text-muted-foreground" />
                          <span>删除</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingTag && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-6">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h2 className="text-lg font-medium mb-4">编辑标签</h2>
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full px-4 py-3 border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary mb-4"
              placeholder="标签名称"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={handleCancelEdit}
                className="flex-1 py-3 rounded-xl bg-accent text-accent-foreground hover:bg-accent/70 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                disabled={!editValue.trim() || editValue === editingTag}
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}