// app/context/NotesContext.tsx

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Note } from '@/lib/types';

// Định nghĩa các giá trị và hàm mà Context sẽ cung cấp
interface NotesContextType {
  notes: Note[];
  addNote: (title: string, content: string) => void;
  deleteNote: (id: string) => void;
  updateNote: (id: string, title: string, content: string) => void;
}

// 1. Tạo Context
const NotesContext = createContext<NotesContextType | undefined>(undefined);

// 2. Tạo "Nhà cung cấp" (Provider)
export const NotesProvider = ({ children }: { children: ReactNode }) => {
  const [notes, setNotes] = useState<Note[]>([]);

  // Hàm để thêm ghi chú mới
  const addNote = (title: string, content: string) => {
    const newNote: Note = {
      id: Date.now().toString(), // Dùng timestamp làm ID đơn giản
      title: title,
      content: content,
      createdAt: new Date().toISOString().split('T')[0], // Tự động lưu ngày tạo
      isPinned: false,
    };
    setNotes(prevNotes => [newNote, ...prevNotes]);
  };

  // Hàm để xóa ghi chú
  const deleteNote = (id: string) => {
    setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
  };

  // Hàm để cập nhật ghi chú
  const updateNote = (id: string, title: string, content: string) => {
    setNotes(prevNotes =>
      prevNotes.map(note =>
        note.id === id ? { ...note, title: title, content: content } : note
      )
    );
  };

  return (
    <NotesContext.Provider value={{ notes, addNote, deleteNote, updateNote }}>
      {children}
    </NotesContext.Provider>
  );
};

// 3. Tạo một "hook" tùy chỉnh để dễ dàng sử dụng Context
export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes phải được sử dụng bên trong NotesProvider');
  }
  return context;
};