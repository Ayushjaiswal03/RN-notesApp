import { create } from "zustand"; 
import { save, load } from "../utils/storage"; 
import { UserRecord } from "../service/authService"; 

// shape of a single note
export type Note = {
  id: string;             
  title: string;          
  body: string;           
  imageUri?: string | null; 
  updatedAt: number;      
  createdAt: number;      
}
// store state + actions
type NotesState = {
  notes: Note[];                  
  loading: boolean;                
  loadNotesForUser: (userId: string) => Promise<void>; 
  addNote: (userId: string, note: Omit<Note, "id" | "createdAt" | "updatedAt">) => Promise<Note>; // add note
  updateNote: (userId: string, note: Note) => Promise<Note | null>; // update existing note
  deleteNote: (userId: string, noteId: string) => Promise<boolean>; // delete note
  clear: () => void;               
};

const NOTES_KEY_PREFIX = "NOTES_"; 

const makeKey = (userId: string) => `${NOTES_KEY_PREFIX}${userId}_V1`; 

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],             
  loading: false,        

  
  loadNotesForUser: async (userId: string) => {
    set({ loading: true });                           
    try {
      const key = makeKey(userId);                   
      const stored = await load<Note[]>(key);         
      set({ notes: stored ?? [], loading: false });   
    } catch (err) {
      console.error("notesStore.loadNotesForUser err:", err);
      set({ notes: [], loading: false });             
    }
  },

  
  addNote: async (userId, noteData) => {
    set({ loading: true });                           
    try {
      const key = makeKey(userId);                    
      const current = (await load<Note[]>(key)) ?? []; 
      const now = Date.now();                         
      const newNote: Note = {
        id: Math.random().toString(36).slice(2, 9),   
        title: noteData.title,
        body: noteData.body,
        imageUri: noteData.imageUri ?? null,
        createdAt: now,
        updatedAt: now,
      };
      const updated = [newNote, ...current];         
      await save(key, updated);                       
      set({ notes: updated, loading: false });       
      return newNote;                                
    } catch (err) {
      console.error("notesStore.addNote err:", err);
      set({ loading: false });
      throw err;                                      
    }
  },

  
  updateNote: async (userId, note) => {
    set({ loading: true });
    try {
      const key = makeKey(userId);
      const current = (await load<Note[]>(key)) ?? [];
      const idx = current.findIndex((n) => n.id === note.id);
      if (idx === -1) {
        set({ loading: false });
        return null; // not found
      }
      const updatedNote: Note = {
        ...current[idx],
        title: note.title,
        body: note.body,
        imageUri: note.imageUri ?? null,
        updatedAt: Date.now(),
      };
      const updated = [...current];
      updated[idx] = updatedNote;
      
      updated.splice(idx, 1);
      updated.unshift(updatedNote);
      await save(key, updated);
      set({ notes: updated, loading: false });
      return updatedNote;
    } catch (err) {
      console.error("notesStore.updateNote err:", err);
      set({ loading: false });
      throw err;
    }
  },

  
  deleteNote: async (userId, noteId) => {
    set({ loading: true });
    try {
      const key = makeKey(userId);
      const current = (await load<Note[]>(key)) ?? [];
      const updated = current.filter((n) => n.id !== noteId); // remove note
      await save(key, updated);
      set({ notes: updated, loading: false });
      return true;
    } catch (err) {
      console.error("notesStore.deleteNote err:", err);
      set({ loading: false });
      return false;
    }
  },

  // clear
  clear: () => set({ notes: [] }),
}));

export default useNotesStore;
