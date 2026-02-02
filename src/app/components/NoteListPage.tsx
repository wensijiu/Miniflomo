import { useState } from 'react';
import { NoteCard, Note } from './NoteCard';
import { Search, X } from 'lucide-react';

interface NoteListPageProps {
  notes: Note[];
  onDeleteNote: (id: string) => void;
  onEditNote: (id: string, content: string, tags: string[]) => void;
  onTagClick?: (tag: string) => void;
  selectedTag?: string | null;
  recentTags: string[];
  frequentTags: string[];
}

export function NoteListPage({ notes, onDeleteNote, onEditNote, onTagClick, selectedTag, recentTags, frequentTags }: NoteListPageProps) {
  const [filter, setFilter] = useState<'all' | 'today' | 'week'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const getFilteredNotes = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    let filtered = notes;

    // Apply tag filter
    if (selectedTag) {
      filtered = filtered.filter(note => note.tags.includes(selectedTag));
    }

    // Apply time filter
    switch (filter) {
      case 'today':
        filtered = filtered.filter(note => note.timestamp >= today.getTime());
        break;
      case 'week':
        filtered = filtered.filter(note => note.timestamp >= weekAgo.getTime());
        break;
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(note => 
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    return filtered;
  };

  const filteredNotes = getFilteredNotes();

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-10">
        <div className="flex items-center justify-center h-14">
          <h1 className="text-base font-medium">笔记</h1>
        </div>
        
        {/* Search Bar */}
        <div className="px-4 sm:px-6 py-2.5 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索笔记内容或标签..."
              className="w-full pl-10 pr-10 py-2 bg-accent rounded-lg outline-none focus:ring-2 focus:ring-primary text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>
        </div>

        {/* Selected Tag Display */}
        {selectedTag && (
          <div className="px-4 sm:px-6 py-2 bg-accent/50 border-b border-border">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">筛选:</span>
              <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs">
                #{selectedTag}
              </span>
              <button
                onClick={() => onTagClick?.(null as any)}
                className="ml-auto text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
        
        {/* Filter Tabs */}
        <div className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 pb-2.5 pt-2.5">
          {[
            { id: 'all', label: '全部' },
            { id: 'today', label: '今天' },
            { id: 'week', label: '本周' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilter(item.id as 'all' | 'today' | 'week')}
              className={`px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm transition-colors ${
                filter === item.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-accent'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto px-4 py-3 sm:py-4 pb-20">
        {filteredNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <p>还没有笔记</p>
            <p className="text-sm mt-2">开始记录你的想法吧</p>
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-3 max-w-lg mx-auto">
            {filteredNotes.map((note) => (
              <NoteCard 
                key={note.id} 
                note={note} 
                onDelete={onDeleteNote} 
                onEdit={onEditNote}
                onTagClick={onTagClick}
                recentTags={recentTags}
                frequentTags={frequentTags}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}