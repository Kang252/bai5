// File: app/create-edit-habit.js
import React, { useState, useLayoutEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, Switch, Platform } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useHabits } from '../src/context/HabitContext';
// Đã xóa import Ionicons
import DateTimePicker from '@react-native-community/datetimepicker';
import { scheduleDailyReminder, scheduleSmartReminder, cancelHabitNotifications } from '../src/services/NotificationService';

// SỬA: Danh sách Emoji thay vì tên Icon
const ICON_OPTIONS = ['📖', '💧', '🌿', '🚶', '🌙', '💪', '💻', '🎵'];
const COLOR_OPTIONS = ['#4A90E2', '#50E3C2', '#F5A623', '#D0021B', '#8B572A', '#9B59B6'];
const FREQUENCY_OPTIONS = ['daily', 'weekly', 'custom'];

export default function CreateEditHabitScreen() {
  const { habitId } = useLocalSearchParams();
  const { habits, addHabit, updateHabit, deleteHabit } = useHabits();

  const isEditing = !!habitId;
  const currentHabit = isEditing ? habits.find(h => h.id === habitId) : null;
  
  // State
  const [title, setTitle] = useState(currentHabit?.title || '');
  const [icon, setIcon] = useState(currentHabit?.icon || ICON_OPTIONS[0]);
  const [description, setDescription] = useState(currentHabit?.description || '');
  const [frequency, setFrequency] = useState(currentHabit?.targetFrequency || FREQUENCY_OPTIONS[0]);
  const [startDate, setStartDate] = useState(currentHabit?.startDate || new Date().toISOString().split('T')[0]);
  const [colorTheme, setColorTheme] = useState(currentHabit?.colorTheme || COLOR_OPTIONS[0]);

  const [enableReminder, setEnableReminder] = useState(!!currentHabit?.reminderTime);
  const [reminderTime, setReminderTime] = useState(currentHabit?.reminderTime ? new Date(currentHabit.reminderTime) : new Date());
  const [reminderMessage, setReminderMessage] = useState(currentHabit?.reminderMessage || '');
  const [showTimePicker, setShowTimePicker] = useState(false);

  useLayoutEffect(() => {
    router.setParams({ 
        title: isEditing ? 'Sửa Thói Quen' : 'Tạo Thói Quen',
        headerRight: () => isEditing && (
            <TouchableOpacity onPress={handleDelete} style={{ marginRight: 10 }}>
                {/* Thay icon thùng rác bằng Text */}
                <Text style={{color: '#D0021B', fontWeight: 'bold', fontSize: 16}}>Xóa</Text>
            </TouchableOpacity>
        ),
    });
  }, [isEditing, habitId]);

  const handleSave = async () => {
    if (!title) {
      alert('Vui lòng nhập tên thói quen.');
      return;
    }

    const habitData = { 
        title, icon, description, 
        targetFrequency: frequency, 
        startDate, colorTheme,
        reminderTime: enableReminder ? reminderTime.toISOString() : null,
        reminderMessage: enableReminder ? reminderMessage : null
    };

    let targetId = habitId;

    if (isEditing) {
      updateHabit(habitId, habitData);
    } else {
      targetId = addHabit(habitData); 
    }

    if (enableReminder) {
        await scheduleDailyReminder(
            targetId, 
            title, 
            reminderTime.getHours(), 
            reminderTime.getMinutes(), 
            reminderMessage
        );
        await scheduleSmartReminder(targetId, title);
    } else {
        await cancelHabitNotifications(targetId);
    }
    
    router.back();
  };

  const handleDelete = async () => {
    if (isEditing) {
        await cancelHabitNotifications(habitId);
        deleteHabit(habitId);
        router.back();
    }
  };

  const onTimeChange = (event, selectedDate) => {
    setShowTimePicker(false);
    if (selectedDate) {
        setReminderTime(selectedDate);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Tên Thói Quen *</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Ví dụ: Chạy bộ" />

      <Text style={styles.label}>Mô Tả</Text>
      <TextInput style={styles.input} value={description} onChangeText={setDescription} placeholder="Chi tiết..." />

      <Text style={styles.label}>Biểu Tượng</Text>
      <View style={styles.rowWrap}>
        {ICON_OPTIONS.map(i => (
          <TouchableOpacity key={i} onPress={() => setIcon(i)} style={[styles.iconOption, icon === i && { borderColor: colorTheme, borderWidth: 2 }]}>
            {/* Hiển thị Emoji thay vì Ionicons */}
            <Text style={{fontSize: 28}}>{i}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Màu Sắc</Text>
      <View style={styles.rowWrap}>
        {COLOR_OPTIONS.map(c => (
          <TouchableOpacity key={c} onPress={() => setColorTheme(c)} style={[styles.colorOption, { backgroundColor: c }, colorTheme === c && { borderWidth: 3, borderColor: '#333' }]} />
        ))}
      </View>

      <View style={styles.divider} />

      <View style={styles.rowBetween}>
          <Text style={styles.label}>Bật Nhắc Nhở Hàng Ngày</Text>
          <Switch value={enableReminder} onValueChange={setEnableReminder} trackColor={{true: colorTheme}} />
      </View>

      {enableReminder && (
          <View style={styles.reminderContainer}>
              <Text style={styles.subLabel}>Thời gian nhắc:</Text>
              <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.timeButton}>
                  <Text style={styles.timeText}>
                    {reminderTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
              </TouchableOpacity>
              
              {showTimePicker && (
                  <DateTimePicker value={reminderTime} mode="time" display="default" onChange={onTimeChange} />
              )}

              <Text style={styles.subLabel}>Tin nhắn nhắc nhở:</Text>
              <TextInput 
                style={styles.input} 
                value={reminderMessage} 
                onChangeText={setReminderMessage} 
                placeholder="Nhập lời nhắn động viên..."
              />
              <Text style={styles.note}>* Hệ thống cũng sẽ tự động nhắc bạn lúc 20:00 (Smart Reminder).</Text>
          </View>
      )}

      <View style={{ marginTop: 30 }}>
        <Button title="Lưu Thói Quen" onPress={handleSave} color={colorTheme} />
      </View>
      <View style={{ height: 50 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  label: { fontSize: 16, fontWeight: 'bold', marginTop: 15, marginBottom: 8, color: '#333' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 16, backgroundColor: '#f9f9f9' },
  rowWrap: { flexDirection: 'row', flexWrap: 'wrap' },
  iconOption: { padding: 10, borderRadius: 10, backgroundColor: '#eee', marginRight: 12, marginBottom: 10 },
  colorOption: { width: 40, height: 40, borderRadius: 20, marginRight: 12, marginBottom: 10 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 20 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  reminderContainer: { backgroundColor: '#F0F4F8', padding: 15, borderRadius: 10, marginTop: 10 },
  subLabel: { fontSize: 14, fontWeight: '600', marginTop: 10, marginBottom: 5, color: '#555' },
  timeButton: { backgroundColor: '#fff', padding: 12, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#ddd' },
  timeText: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  note: { fontSize: 12, color: '#888', marginTop: 8, fontStyle: 'italic' }
});