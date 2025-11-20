// File: src/components/HabitListItem.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// Đã xóa import Ionicons
import { useHabits } from '../context/HabitContext';
import { getTodayDateKey } from '../utils/dateUtils'; 

const HabitListItem = ({ habit, onPress }) => {
  const { toggleCompletion } = useHabits();
  const todayKey = getTodayDateKey();
  
  const isCompletedToday = habit.completionHistory[todayKey] || false; 

  const handleToggle = () => {
    toggleCompletion(habit.id, todayKey);
  };

  return (
    <TouchableOpacity 
      onPress={handleToggle}
      onLongPress={() => onPress(habit.id)} 
      style={[
        styles.card, 
        { 
          borderColor: habit.colorTheme, 
          backgroundColor: isCompletedToday ? habit.colorTheme + '10' : '#fff' 
        }
      ]} 
    >
      <View style={styles.leftContainer}>
        {/* Thay Icon bằng Text Emoji */}
        <View style={[styles.iconContainer, {backgroundColor: habit.colorTheme + '20'}]}>
             <Text style={{ fontSize: 24 }}>{habit.icon}</Text>
        </View>
       
        <View>
          <Text style={styles.title}>{habit.title}</Text>
          <Text style={styles.streakText}>
            🔥 Chuỗi ngày: <Text style={{fontWeight:'bold'}}>{habit.currentStreak}</Text> ngày 
          </Text>
        </View>
      </View>

      {/* Thay dấu check icon bằng ký tự chữ V */}
      <View style={[
          styles.statusCircle, 
          { backgroundColor: isCompletedToday ? habit.colorTheme : '#ddd' }
        ]}
      >
        {isCompletedToday && <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>✓</Text>}
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