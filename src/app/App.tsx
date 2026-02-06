import { useState, useEffect } from 'react';
import { TabBar } from '@/app/components/TabBar';
import { QuickInputPage } from '@/app/components/QuickInputPage';
import { NoteListPage } from '@/app/components/NoteListPage';
import { CalendarPage } from '@/app/components/CalendarPage';
import { TagsPage } from '@/app/components/TagsPage';
import { RandomReviewPage } from '@/app/components/RandomReviewPage';
import { StatsPage } from '@/app/components/StatsPage';
import { ProfilePage } from '@/app/components/ProfilePage';
import { ReminderSettingsPage } from '@/app/components/ReminderSettingsPage';
import { AboutPage } from '@/app/components/AboutPage';
import { HelpPage } from '@/app/components/HelpPage';
import { GoalSettings, loadGoals, saveGoals, Goals } from '@/app/components/GoalSettings';
import { AuthPage } from '@/app/components/AuthPage';
import { Note } from '@/app/components/NoteCard';
import { SimpleToast } from '@/app/components/SimpleToast';
import * as api from '@/app/utils/api';

interface User {
  phone: string;
  nickname: string;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'input' | 'review' | 'tags' | 'profile'>('input');
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showRandomReview, setShowRandomReview] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showGoalSettings, setShowGoalSettings] = useState(false);
  const [showReminderSettings, setShowReminderSettings] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [goals, setGoals] = useState<Goals>(loadGoals());
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('ria-user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('ria-user');
      }
    }

    // Test backend connection
    api.healthCheck().then(result => {
      console.log('Backend health check:', result);
      if (result.error) {
        console.error('⚠️ Backend is not responding. Server may not be deployed yet.');
      } else {
        console.log('✅ Backend is healthy');
      }
    });
  }, []);

  // Load notes from backend when authenticated
  useEffect(() => {
    if (!isAuthenticated || !user) return;
    
    const loadNotes = async () => {
      const loadedNotes = await api.getNotes(user.phone);
      setNotes(loadedNotes);
      console.log(`Loaded ${loadedNotes.length} notes`);
      
      // Check if we're using localStorage fallback
      if (loadedNotes.length > 0) {
        const localNotes = localStorage.getItem('ria-notes');
        if (localNotes) {
          try {
            const parsedLocalNotes = JSON.parse(localNotes);
            if (parsedLocalNotes.length > 0 && loadedNotes === parsedLocalNotes) {
              console.warn('📱 Using local storage. Your data is only saved on this device.');
              setToastMessage('当前使用本地存储，数据仅保存在此设备');
              setShowToast(true);
            }
          } catch (e) {
            // Ignore parse errors
          }
        }
      }
    };

    loadNotes();
  }, [isAuthenticated, user]);

  // Authentication handlers
  const handleLogin = async (phone: string, code: string) => {
    const result = await api.login(phone, code);
    
    if (result.success && result.user) {
      const userData: User = { phone: result.user.phone, nickname: result.user.nickname };
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('ria-user', JSON.stringify(userData));
      setToastMessage(`欢迎回来，${result.user.nickname}！`);
      setShowToast(true);
    } else {
      setToastMessage(result.error || '登录失败');
      setShowToast(true);
    }
  };

  const handleRegister = async (phone: string, code: string, nickname: string) => {
    const result = await api.register(phone, code, nickname);
    
    if (result.success && result.user) {
      const userData: User = { phone: result.user.phone, nickname: result.user.nickname };
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('ria-user', JSON.stringify(userData));
      setToastMessage(`注册成功，欢迎！`);
      setShowToast(true);
    } else {
      setToastMessage(result.error || '注册失败');
      setShowToast(true);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('ria-user');
    setNotes([]);
    setActiveTab('input');
    setToastMessage('已退出登录');
    setShowToast(true);
  };

  // Show auth page if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="h-screen flex flex-col bg-background max-w-lg mx-auto relative">
        <AuthPage onLogin={handleLogin} onRegister={handleRegister} />
        <SimpleToast message={toastMessage} show={showToast} onClose={() => setShowToast(false)} />
      </div>
    );
  }

  const handleAddNote = async (content: string, tags: string[]) => {
    if (!user) return;
    
    const result = await api.createNote(user.phone, content, tags);
    
    if (result.success && result.note) {
      setNotes([result.note, ...notes]);
      setToastMessage('笔记已保存');
      setShowToast(true);
    } else {
      setToastMessage(result.error || '保存失败');
      setShowToast(true);
    }
  };

  const handleDeleteNote = async (id: string) => {
    if (!user) return;
    
    const result = await api.deleteNote(user.phone, id);
    
    if (result.success) {
      setNotes(notes.filter(note => note.id !== id));
      setToastMessage('笔记已删除');
      setShowToast(true);
    } else {
      setToastMessage(result.error || '删除失败');
      setShowToast(true);
    }
  };

  const handleEditNote = async (id: string, content: string, tags: string[]) => {
    if (!user) return;
    
    const result = await api.updateNote(user.phone, id, content, tags);
    
    if (result.success && result.note) {
      setNotes(notes.map(note => 
        note.id === id ? result.note! : note
      ));
      setToastMessage('笔记已更新');
      setShowToast(true);
    } else {
      setToastMessage(result.error || '更新失败');
      setShowToast(true);
    }
  };

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag);
    setActiveTab('review');
  };

  const handleTagClickInReview = (tag: string | null) => {
    setSelectedTag(tag);
  };

  const handleRenameTag = async (oldTag: string, newTag: string) => {
    if (!user) return;
    
    // 找到所有包含该标签的笔记
    const affectedNotes = notes.filter(note => note.tags.includes(oldTag));
    
    // 批量更新所有受影响的笔记
    const updatePromises = affectedNotes.map(note => {
      const newTags = note.tags.map(tag => tag === oldTag ? newTag : tag);
      return api.updateNote(user.phone, note.id, note.content, newTags);
    });
    
    const results = await Promise.all(updatePromises);
    
    // 检查是否有失败的更新
    const hasError = results.some(result => !result.success);
    
    if (!hasError) {
      // 更新本地状态
      setNotes(notes.map(note => ({
        ...note,
        tags: note.tags.map(tag => tag === oldTag ? newTag : tag)
      })));
      setToastMessage('标签已重命名');
      setShowToast(true);
    } else {
      setToastMessage('部分笔记更新失败');
      setShowToast(true);
    }
  };

  const handleDeleteTag = async (tagToDelete: string) => {
    if (!user) return;
    
    // 找到所有包含该标签的笔记
    const affectedNotes = notes.filter(note => note.tags.includes(tagToDelete));
    
    // 批量更新所有受影响的笔记
    const updatePromises = affectedNotes.map(note => {
      const newTags = note.tags.filter(tag => tag !== tagToDelete);
      return api.updateNote(user.phone, note.id, note.content, newTags);
    });
    
    const results = await Promise.all(updatePromises);
    
    // 检查是否有失败的更新
    const hasError = results.some(result => !result.success);
    
    if (!hasError) {
      // 更新本地状态
      setNotes(notes.map(note => ({
        ...note,
        tags: note.tags.filter(tag => tag !== tagToDelete)
      })));
      setToastMessage('标签已删除');
      setShowToast(true);
    } else {
      setToastMessage('部分笔记更新失败');
      setShowToast(true);
    }
  };

  // Get recent tags for quick input
  const getRecentTags = () => {
    const allTags = notes.flatMap(note => note.tags);
    const uniqueTags = Array.from(new Set(allTags));
    return uniqueTags.slice(0, 10);
  };

  // Get frequent tags (sorted by usage count)
  const getFrequentTags = () => {
    const tagCounts = notes.reduce((acc, note) => {
      note.tags.forEach(tag => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([tag]) => tag)
      .slice(0, 12);
  };

  // Filter notes by selected tag
  const getDisplayNotes = () => {
    if (selectedTag) {
      return notes.filter(note => note.tags.includes(selectedTag));
    }
    return notes;
  };

  const renderContent = () => {
    // Show random review if active
    if (showRandomReview) {
      return <RandomReviewPage notes={notes} onClose={() => setShowRandomReview(false)} />;
    }

    // Show stats if active
    if (showStats) {
      return <StatsPage notes={notes} onClose={() => setShowStats(false)} />;
    }

    // Show calendar if active
    if (showCalendar) {
      return <CalendarPage notes={notes} onNoteDelete={handleDeleteNote} onNoteUpdate={handleEditNote} onBackToList={() => setShowCalendar(false)} />;
    }

    // Show goal settings if active
    if (showGoalSettings) {
      return <GoalSettings goals={goals} onGoalsChange={setGoals} onClose={() => setShowGoalSettings(false)} />;
    }

    // Show reminder settings if active
    if (showReminderSettings) {
      return <ReminderSettingsPage onClose={() => setShowReminderSettings(false)} />;
    }

    // Show about page if active
    if (showAbout) {
      return <AboutPage onClose={() => setShowAbout(false)} />;
    }

    // Show help page if active
    if (showHelp) {
      return <HelpPage onClose={() => setShowHelp(false)} />;
    }

    switch (activeTab) {
      case 'input':
        return <QuickInputPage onAddNote={handleAddNote} recentTags={getRecentTags()} frequentTags={getFrequentTags()} />;
      case 'review':
        return (
          <NoteListPage
            notes={notes}
            onDeleteNote={handleDeleteNote}
            onEditNote={handleEditNote}
            onTagClick={handleTagClickInReview}
            selectedTag={selectedTag}
            recentTags={getRecentTags()}
            frequentTags={getFrequentTags()}
          />
        );
      case 'tags':
        return <TagsPage notes={notes} onTagClick={handleTagClick} onRenameTag={handleRenameTag} onDeleteTag={handleDeleteTag} />;
      case 'profile':
        return <ProfilePage notes={notes} onRandomReview={() => setShowRandomReview(true)} onStats={() => setShowStats(true)} onCalendar={() => setShowCalendar(true)} onGoalSettings={() => setShowGoalSettings(true)} onReminderSettings={() => setShowReminderSettings(true)} onAbout={() => setShowAbout(true)} onHelp={() => setShowHelp(true)} onLogout={handleLogout} goals={goals} userNickname={user?.nickname} />; 
      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background max-w-lg mx-auto relative">
      <div className="flex-1 overflow-hidden pb-16">
        {renderContent()}
      </div>
      {!showRandomReview && !showStats && !showCalendar && !showGoalSettings && !showReminderSettings && !showAbout && !showHelp && (
        <TabBar activeTab={activeTab} onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab !== 'review') {
            setSelectedTag(null);
          }
        }} />
      )}
      <SimpleToast message={toastMessage} show={showToast} onClose={() => setShowToast(false)} />
    </div>
  );
}

export default App;