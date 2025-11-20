// File: src/components/HabitListItem.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useHabits } from '../context/HabitContext';
import { getTodayDateKey } from '../utils/dateUtils'; // Import helper

const HabitListItem = ({ habit, onPress }) => {
  const { toggleCompletion } = useHabits();
  const todayKey = getTodayDateKey();
  
  // FR-3: Trạng thái hoàn thành hôm nay
  const isCompletedToday = habit.completionHistory[todayKey] || false; 

  const handleToggle = () => {
    // FR-4: Người dùng chạm vào thói quen để đánh dấu hoàn thành cho ngày hiện tại
    toggleCompletion(habit.id, todayKey);
  };

  return (
    <TouchableOpacity 
      onPress={handleToggle}
      onLongPress={() => onPress(habit.id)} // Nhấn giữ để sửa
      style={[
        styles.card, 
        { 
          borderColor: habit.colorTheme, 
          backgroundColor: isCompletedToday ? habit.colorTheme + '10' : '#fff' 
        }
      ]} 
    >
      <View style={styles.leftContainer}>
        {/* FR-3: Icon */}
        <View style={[styles.iconContainer, {backgroundColor: habit.colorTheme + '20'}]}>
             <Ionicons name={habit.icon} size={24} color={habit.colorTheme} />
        </View>
       
        <View>
          {/* FR-3: Title */}
          <Text style={styles.title}>{habit.title}</Text>
          <Text style={styles.streakText}>
            🔥 Chuỗi ngày: **{habit.currentStreak}** ngày 
          </Text>
        </View>
      </View>

      {/* FR-3, FR-4: Trạng thái hoàn thành hôm nay */}
      <View style={[
          styles.statusCircle, 
          { backgroundColor: isCompletedToday ? habit.colorTheme : '#ddd' }
        ]}
      >
        {isCompletedToday && <Ionicons name="checkmark" size={20} color="#fff" />}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        marginHorizontal: 15,
        marginVertical: 8,
        borderRadius: 12,
        borderLeftWidth: 5,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    streakText: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    statusCircle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
    },
});

export default HabitListItem;