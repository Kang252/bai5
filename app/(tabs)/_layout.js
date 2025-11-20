import React from 'react';
import { Tabs } from 'expo-router';
import { Text, Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ 
        tabBarActiveTintColor: '#4A90E2', 
        headerShown: false, 
        tabBarStyle: { 
            height: Platform.OS === 'ios' ? 85 : 60, 
            paddingBottom: Platform.OS === 'ios' ? 30 : 10, 
            paddingTop: 5 
        } 
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Thói Quen',
          tabBarIcon: ({ color }) => <Text style={{color, fontSize: 24}}>📝</Text>,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Lịch',
          tabBarIcon: ({ color }) => <Text style={{color, fontSize: 24}}>📅</Text>,
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'Phân Tích',
          tabBarIcon: ({ color }) => <Text style={{color, fontSize: 24}}>📊</Text>,
        }}
      />
    </Tabs>
  );
}