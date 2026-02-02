import { projectId, publicAnonKey } from '/utils/supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-816b7951`;

// Debug: Log API configuration
console.log('API Configuration:', {
  projectId,
  API_BASE_URL,
  hasAnonKey: !!publicAnonKey
});

// Health check function
export async function healthCheck(): Promise<{ status: string; error?: string }> {
  try {
    console.log('Testing health check at:', `${API_BASE_URL}/health`);
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });

    if (!response.ok) {
      console.error('Health check failed with status:', response.status);
      return { status: 'error', error: `HTTP ${response.status}` };
    }

    const data = await response.json();
    console.log('Health check response:', data);
    return data;
  } catch (error) {
    console.error('Health check error:', error);
    return { status: 'error', error: String(error) };
  }
}

interface Note {
  id: string;
  content: string;
  tags: string[];
  timestamp: number;
}

interface User {
  phone: string;
  nickname: string;
}

// ========== 认证相关 API ==========

export async function sendVerificationCode(phone: string): Promise<{ success: boolean; devCode?: string; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/send-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({ phone }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'Failed to send code' };
    }

    return data;
  } catch (error) {
    console.error('Send verification code error:', error);
    return { success: false, error: 'Network error' };
  }
}

export async function register(phone: string, code: string, nickname: string): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({ phone, code, nickname }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'Registration failed' };
    }

    return data;
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: 'Network error' };
  }
}

export async function login(phone: string, code: string): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({ phone, code }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'Login failed' };
    }

    return data;
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Network error' };
  }
}

// ========== 笔记相关 API ==========

export async function getNotes(userPhone: string): Promise<Note[]> {
  try {
    console.log('Getting notes for user:', userPhone);
    const response = await fetch(`${API_BASE_URL}/notes`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'X-User-Phone': userPhone,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Get notes failed with status:', response.status, errorText);
      
      // If user not found (404), this is likely a legacy user from localStorage
      // We'll use localStorage fallback instead of throwing error
      if (response.status === 404) {
        console.warn('⚠️ User not found in backend, using localStorage fallback');
        const localNotes = localStorage.getItem('ria-notes');
        if (localNotes) {
          try {
            return JSON.parse(localNotes);
          } catch (e) {
            console.error('Failed to parse local notes:', e);
            return [];
          }
        }
        return [];
      }
      
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('Get notes response:', data);
    return data.notes || [];
  } catch (error) {
    console.error('Get notes error:', error);
    
    // Fallback to localStorage if backend is not available
    console.warn('⚠️ Backend unavailable, using localStorage fallback');
    const localNotes = localStorage.getItem('ria-notes');
    if (localNotes) {
      try {
        return JSON.parse(localNotes);
      } catch (e) {
        console.error('Failed to parse local notes:', e);
        return [];
      }
    }
    return [];
  }
}

export async function createNote(phone: string, content: string, tags: string[]): Promise<{ success: boolean; note?: Note; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
        'X-User-Phone': phone,
      },
      body: JSON.stringify({ content, tags }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'Failed to create note' };
    }

    // Also save to localStorage for offline support
    const localNotes = await getNotes(phone);
    if (data.note) {
      localNotes.unshift(data.note);
      localStorage.setItem('ria-notes', JSON.stringify(localNotes));
    }

    return data;
  } catch (error) {
    console.error('Create note error:', error);
    
    // Fallback to localStorage
    console.warn('⚠️ Backend unavailable, using localStorage fallback');
    const note: Note = {
      id: Date.now().toString(),
      content,
      tags,
      timestamp: Date.now(),
    };
    
    const localNotes = localStorage.getItem('ria-notes');
    const notes = localNotes ? JSON.parse(localNotes) : [];
    notes.unshift(note);
    localStorage.setItem('ria-notes', JSON.stringify(notes));
    
    return { success: true, note };
  }
}

export async function updateNote(phone: string, noteId: string, content: string, tags: string[]): Promise<{ success: boolean; note?: Note; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
        'X-User-Phone': phone,
      },
      body: JSON.stringify({ content, tags }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'Failed to update note' };
    }

    // Also update localStorage
    const localNotes = await getNotes(phone);
    const updatedNotes = localNotes.map(note => 
      note.id === noteId ? { ...note, content, tags } : note
    );
    localStorage.setItem('ria-notes', JSON.stringify(updatedNotes));

    return data;
  } catch (error) {
    console.error('Update note error:', error);
    
    // Fallback to localStorage
    console.warn('⚠️ Backend unavailable, using localStorage fallback');
    const localNotes = localStorage.getItem('ria-notes');
    if (localNotes) {
      const notes = JSON.parse(localNotes);
      const noteIndex = notes.findIndex((n: Note) => n.id === noteId);
      if (noteIndex !== -1) {
        notes[noteIndex] = { ...notes[noteIndex], content, tags };
        localStorage.setItem('ria-notes', JSON.stringify(notes));
        return { success: true, note: notes[noteIndex] };
      }
    }
    
    return { success: false, error: 'Note not found' };
  }
}

export async function deleteNote(phone: string, noteId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
        'X-User-Phone': phone,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'Failed to delete note' };
    }

    // Also delete from localStorage
    const localNotes = await getNotes(phone);
    const filteredNotes = localNotes.filter(note => note.id !== noteId);
    localStorage.setItem('ria-notes', JSON.stringify(filteredNotes));

    return data;
  } catch (error) {
    console.error('Delete note error:', error);
    
    // Fallback to localStorage
    console.warn('⚠️ Backend unavailable, using localStorage fallback');
    const localNotes = localStorage.getItem('ria-notes');
    if (localNotes) {
      const notes = JSON.parse(localNotes);
      const filteredNotes = notes.filter((n: Note) => n.id !== noteId);
      localStorage.setItem('ria-notes', JSON.stringify(filteredNotes));
      return { success: true };
    }
    
    return { success: false, error: 'Note not found' };
  }
}