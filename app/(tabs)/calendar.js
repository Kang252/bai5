// File: app/(tabs)/calendar.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars'; 
import { useHabits } from '../../src/context/HabitContext'; 
import { getTodayDateKey } from '../../src/utils/dateUtils'; 

// Hàm helper để tạo đánh dấu ngày (dựa trên FR-5)
const getMarkedDates = (habits) => {
  let markedDates = {};
  
  habits.forEach(habit => {
    for (const date in habit.completionHistory) {
      const isCompleted = habit.completionHistory[date];
      
      if (!markedDates[date]) {
        markedDates[date] = { dots: [] };
      }

      if (isCompleted) {
        markedDates[date].dots.push({ key: habit.id, color: habit.colorTheme });
      }
    }
  });

  // Đánh dấu ngày hiện tại
  markedDates[getTodayDateKey()] = { 
    ...markedDates[getTodayDateKey()], 
    selected: true, 
    selectedColor: '#00adf5',
    selectedTextColor: '#ffffff'
  };
  
  return markedDates;
};


export default function CalendarScreen() {
  const { habits } = useHabits();
  const markedDates = getMarkedDates(habits);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>🗓️ Tiến Trình Hàng Tháng</Text>
      
      <Calendar
        markingType={'multi-dot'} 
        markedDates={markedDates}
        theme={{
          todayTextColor: '#4A90E2',
          arrowColor: '#4A90E2',
        }}
        style={styles.calendar}
      />

      {/* Phần Hiển thị Tổng quan */}
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Tổng Quan Hoàn Thành</Text>
        
        {habits.map(habit => (
            <View key={habit.id} style={styles.habitStatus}>
                <View style={[styles.dot, { backgroundColor: habit.colorTheme }]} />
                <Text style={styles.habitTitle}>{habit.title}</Text>
                <Text>
                    - Hoàn thành: {habit.totalCompletedDays} ngày
                    (Chuỗi: {habit.currentStreak})
                </Text>
            </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  calendar: {
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingBottom: 10,
  },
  summaryContainer: {
    padding: 20,
    marginTop: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  habitStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  habitTitle: {
    fontWeight: '500',
    marginRight: 5,
  }
});