// File: App.js (Tại thư mục gốc)
import React from 'react';
// Đảm bảo import HabitProvider là named import
import { HabitProvider } from './src/context/HabitContext';
import RootLayout from './app/_layout'; // Expo Router sử dụng _layout làm gốc

// Expo Router thường mong đợi file entry point là main.js hoặc App.js
// Chúng ta sẽ dùng file này để cung cấp Context cho toàn bộ ứng dụng.
export default function App() {
  return (
    <HabitProvider>
      {/* RootLayout (chứa Stack Navigator và Tabs) là con của Provider */}
      <RootLayout /> 
    </HabitProvider>
  );
}