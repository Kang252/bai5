// File: src/components/HabitListItem.js (ĐÃ CẬP NHẬT)
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useHabits } from '../context/HabitContext';

const getTodayDateKey = () => new Date().toISOString().split('T')[0];

// Thêm prop onPress để xử lý điều hướng sang màn hình chỉnh sửa
const HabitListItem = ({ habit, onPress }) => {
  const { toggleCompletion } = useHabits();
  const todayKey = getTodayDateKey();
  
  // FR-3: Trạng thái hoàn thành hôm nay
  const isCompletedToday = habit.completionHistory[todayKey] || false; 

  const handleToggle = () => {
    // FR-4: Người dùng chạm vào thói quen để đánh dấu hoàn thành
    toggleCompletion(habit.id, todayKey);
  };
  
  // Tạm thời dùng TouchableOpacity với onPress để chuyển trạng thái
  return (
    <TouchableOpacity 
      style={[styles.card, { borderColor: habit.colorTheme, backgroundColor: isCompletedToday ? habit.colorTheme + '30' : '#fff' }]} 
      onPress={handleToggle} // Nhấn để chuyển trạng thái
      onLongPress={onPress} // Nhấn giữ để sửa thói quen
    >
      <View style={styles.leftContainer}>
        {/* FR-3: Icon */}
        <Ionicons name={habit.icon} size={30} color={habit.colorTheme} style={styles.icon} />
        <View>
          {/* FR-3: Title */}
          <Text style={styles.title}>{habit.title}</Text>
          <Text style={styles.streakText}>
            🔥 Chuỗi ngày: **{habit.currentStreak}** ngày 
          </Text>
        </View>
      </View>

      {/* FR-3, FR-4: Trạng thái hoàn thành hôm nay */}
      <View style={[styles.statusCircle, { backgroundColor: isCompletedToday ? habit.colorTheme : '#ddd' }]}>
        {isCompletedToday && <Ionicons name="checkmark" size={20} color="#fff" />}
      </View>
    </TouchableOpacity>
  );
};

// ... (Giữ nguyên hoặc thêm Styles cần thiết, ví dụ styles.card, styles.icon, v.v.)

export default HabitListItem;