// File: app/_layout.js
import React from 'react';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      {/* Đường dẫn mặc định '/' sẽ được tìm thấy trong app/(tabs)/index.js 
        Chúng ta sẽ ẩn tiêu đề của trang chính (Home/List)
      */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      
      {/* Màn hình cho việc Tạo hoặc Chỉnh sửa thói quen. 
        Chúng ta sẽ thiết lập tiêu đề tùy chỉnh cho màn hình này sau.
      */}
      <Stack.Screen 
        name="create-edit-habit" 
        options={{ 
            title: 'Tạo Thói Quen Mới', 
            presentation: 'modal' // Dùng modal cho trải nghiệm tốt hơn
        }} 
      />
    </Stack>
  );
}