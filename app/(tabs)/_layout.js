// File: app/(tabs)/_layout.js
import React from 'react';
import { Tabs } from 'expo-router';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ 
        tabBarActiveTintColor: '#4A90E2', 
        headerShown: false, // Quản lý header riêng lẻ trong từng màn hình tab
        tabBarStyle: { height: 60, paddingBottom: 10, paddingTop: 5 } // Căn chỉnh tab bar
    }}>
      {/* Tab 1: Danh sách Thói quen (FR-3) */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Thói Quen',
          tabBarIcon: ({ color }) => <Ionicons name="list" size={24} color={color} />,
        }}
      />
      
      {/* Tab 2: Lịch (FR-5) */}
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Lịch',
          tabBarIcon: ({ color }) => <Ionicons name="calendar-outline" size={24} color={color} />,
        }}
      />
      
      {/* Tab 3: Phân tích (FR-9, FR-10) */}
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'Phân Tích',
          tabBarIcon: ({ color }) => <Ionicons name="stats-chart-outline" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}