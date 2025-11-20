// File: app/_layout.js
import React from 'react';
import { Stack } from 'expo-router';
import { HabitProvider } from '../src/context/HabitContext'; 
import { SafeAreaProvider } from 'react-native-safe-area-context'; 
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    // Bọc toàn bộ bằng SafeAreaProvider và HabitProvider tại đây
    <SafeAreaProvider>
      <HabitProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen 
              name="create-edit-habit" 
              options={{ 
                  title: 'Tạo Thói Quen Mới', 
                  presentation: 'modal' 
              }} 
          />
        </Stack>
        <StatusBar style="auto" />
      </HabitProvider>
    </SafeAreaProvider>
  );
}