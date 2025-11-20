// File: app/(tabs)/calendar.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars'; 
import { useHabits } from '../../src/context/HabitContext'; 
import { getTodayDateKey } from '../../src/utils/dateUtils'; 

// Helper tạo đánh dấu cho lịch
const getMarkedDates = (habits) => {
  let markedDates = {};
  const todayKey = getTodayDateKey();
  const todayDate = new Date(); // Ngày hiện tại

  habits.forEach(habit => {
    // 1. Đánh dấu ngày hoàn thành (màu theo theme)
    for (const date in habit.completionHistory) {
      if (habit.completionHistory[date]) {
        if (!markedDates[date]) markedDates[date] = { dots: [] };
        markedDates[date].dots.push({ key: `${habit.id}-done`, color: habit.colorTheme });
      }
    }

    // 2. Đánh dấu ngày BỎ LỠ (Missed days - FR-5)
    // Duyệt từ ngày bắt đầu (startDate) đến ngày hôm qua
    if (habit.startDate) {
        let loopDate = new Date(habit.startDate);
        // Chỉ duyệt đến trước ngày hôm nay (hôm nay chưa hết ngày chưa tính là miss)
        while (loopDate < todayDate) {
            const dateStr = loopDate.toISOString().split('T')[0];
            
            // Nếu ngày này chưa hoàn thành VÀ không phải hôm nay -> Missed
            if (dateStr !== todayKey && !habit.completionHistory[dateStr]) {
                if (!markedDates[dateStr]) markedDates[dateStr] = { dots: [] };
                // FR-5: Missed days = gray dots
                markedDates[dateStr].dots.push({ key: `${habit.id}-miss`, color: '#BDBDBD' });
            }
            
            // Tăng ngày lên 1
            loopDate.setDate(loopDate.getDate() + 1);
        }
    }
  });

  // Đánh dấu ngày hôm nay để người dùng dễ thấy
  markedDates[todayKey] = { 
    ...markedDates[todayKey], 
    selected: true, 
    selectedColor: '#E1F5FE',
    selectedTextColor: '#0288D1'
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
          dotStyle: { width: 6, height: 6, marginTop: 2 }
        }}
        style={styles.calendar}
      />

      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Chú giải:</Text>
        <View style={styles.legendRow}>
            <View style={[styles.dotLegend, { backgroundColor: '#4A90E2' }]} />
            <Text style={styles.legendText}>Đã hoàn thành</Text>
        </View>
        <View style={styles.legendRow}>
            <View style={[styles.dotLegend, { backgroundColor: '#BDBDBD' }]} />
            <Text style={styles.legendText}>Bỏ lỡ (Missed)</Text>
        </View>

        <Text style={[styles.summaryTitle, { marginTop: 20 }]}>Chi tiết:</Text>
        {habits.map(habit => (
            <View key={habit.id} style={styles.habitStatus}>
                <View style={[styles.dot, { backgroundColor: habit.colorTheme }]} />
                <Text style={styles.habitTitle}>{habit.title}</Text>
                <Text style={styles.habitStreak}>
                    (Chuỗi: {habit.currentStreak} ngày)
                </Text>
            </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { fontSize: 22, fontWeight: 'bold', padding: 20, paddingTop: 60, backgroundColor: '#f9f9f9' },
  calendar: { marginBottom: 10, borderBottomWidth: 1, borderColor: '#eee' },
  summaryContainer: { padding: 20 },
  summaryTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  legendRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  dotLegend: { width: 12, height: 12, borderRadius: 6, marginRight: 10 },
  legendText: { fontSize: 14, color: '#555' },
  habitStatus: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, paddingVertical: 5, borderBottomWidth: 1, borderColor: '#f0f0f0' },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 10 },
  habitTitle: { fontWeight: '600', fontSize: 16, marginRight: 5, flex: 1 },
  habitStreak: { color: '#FF9800', fontWeight: 'bold' }
});