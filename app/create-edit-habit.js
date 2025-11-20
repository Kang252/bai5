// File: app/create-edit-habit.js
import React, { useState, useLayoutEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useHabits } from '../src/context/HabitContext'; // Điều chỉnh đường dẫn
import Ionicons from 'react-native-vector-icons/Ionicons';

// Mảng Icon và Màu sắc giả để người dùng lựa chọn (FR-1: Icon & Color theme)
const ICON_OPTIONS = ['book', 'droplet', 'leaf', 'walk', 'moon'];
const COLOR_OPTIONS = ['#4A90E2', '#50E3C2', '#F5A623', '#D0021B', '#8B572A'];

const FREQUENCY_OPTIONS = ['daily', 'weekly', 'custom']; // FR-1: Target frequency

export default function CreateEditHabitScreen() {
  const { habitId } = useLocalSearchParams();
  const { habits, addHabit, updateHabit, deleteHabit } = useHabits();

  const isEditing = !!habitId;
  const currentHabit = isEditing ? habits.find(h => h.id === habitId) : null;
  
  const [title, setTitle] = useState(currentHabit?.title || '');
  const [icon, setIcon] = useState(currentHabit?.icon || ICON_OPTIONS[0]);
  const [description, setDescription] = useState(currentHabit?.description || '');
  const [frequency, setFrequency] = useState(currentHabit?.targetFrequency || FREQUENCY_OPTIONS[0]);
  const [startDate, setStartDate] = useState(currentHabit?.startDate || new Date().toISOString().split('T')[0]);
  const [colorTheme, setColorTheme] = useState(currentHabit?.colorTheme || COLOR_OPTIONS[0]);

  // Cập nhật tiêu đề màn hình động
  useLayoutEffect(() => {
    router.setParams({ 
        title: isEditing ? `Sửa: ${currentHabit?.title}` : 'Tạo Thói Quen Mới',
        // Thiết lập button Xóa ở góc phải (chỉ trong chế độ chỉnh sửa)
        headerRight: () => isEditing && (
            <TouchableOpacity onPress={handleDelete} style={{ marginRight: 10 }}>
                <Ionicons name="trash-outline" size={24} color="#D0021B" />
            </TouchableOpacity>
        ),
    });
  }, [isEditing, currentHabit?.title]);

  // --- Xử lý Logic ---

  const handleSave = () => {
    if (!title || !icon || !frequency) {
      alert('Vui lòng điền đủ Tiêu đề, Icon và Tần suất.');
      return;
    }

    const habitData = { title, icon, description, targetFrequency: frequency, startDate, colorTheme };

    if (isEditing) {
      // FR-2: Cập nhật thói quen
      updateHabit(habitId, habitData);
      console.log('Thói quen đã được cập nhật:', habitId);
    } else {
      // FR-1: Tạo thói quen mới
      addHabit(habitData);
      console.log('Thói quen mới đã được thêm');
    }
    
    router.back();
  };

  const handleDelete = () => {
    // FR-2: Xóa thói quen
    if (isEditing) {
        if (confirm('Bạn có chắc chắn muốn xóa thói quen này? Hành động này không thể hoàn tác.')) {
            deleteHabit(habitId);
            console.log('Thói quen đã bị xóa:', habitId);
            router.back();
        }
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Trường Tiêu đề (Bắt buộc) */}
      <Text style={styles.label}>Tên Thói Quen (Bắt buộc)</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Ví dụ: Đọc sách 30 phút"
      />

      {/* Trường Mô tả (Tùy chọn) */}
      <Text style={styles.label}>Mô Tả (Tùy chọn)</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Mô tả chi tiết về thói quen..."
        multiline
      />

      {/* Trường Icon (Bắt buộc) */}
      <Text style={styles.label}>Icon (Bắt buộc)</Text>
      <View style={styles.pickerContainer}>
        {ICON_OPTIONS.map(iconName => (
          <TouchableOpacity
            key={iconName}
            onPress={() => setIcon(iconName)}
            style={[styles.iconOption, icon === iconName && { borderColor: colorTheme, borderWidth: 3 }]}
          >
            <Ionicons name={iconName} size={30} color="#333" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Trường Màu sắc (Tùy chọn) */}
      <Text style={styles.label}>Màu Chủ Đạo (Tùy chọn)</Text>
      <View style={styles.pickerContainer}>
        {COLOR_OPTIONS.map(colorCode => (
          <TouchableOpacity
            key={colorCode}
            onPress={() => setColorTheme(colorCode)}
            style={[
              styles.colorOption,
              { backgroundColor: colorCode },
              colorTheme === colorCode && { borderWidth: 3, borderColor: '#333' }
            ]}
          />
        ))}
      </View>
      
      {/* Trường Tần suất (Bắt buộc) */}
      <Text style={styles.label}>Tần Suất (Bắt buộc)</Text>
      <View style={styles.pickerContainer}>
        {FREQUENCY_OPTIONS.map(freq => (
          <TouchableOpacity
            key={freq}
            onPress={() => setFrequency(freq)}
            style={[styles.frequencyOption, frequency === freq && styles.frequencySelected]}
          >
            <Text style={[styles.frequencyText, frequency === freq && styles.frequencyTextSelected]}>
              {freq.charAt(0).toUpperCase() + freq.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Trường Ngày bắt đầu (Mặc định là hôm nay) */}
      <Text style={styles.label}>Ngày Bắt Đầu</Text>
      {/* Trong ứng dụng thực tế, bạn nên dùng thư viện DatePicker. 
          Ở đây, chúng ta dùng TextInput để đơn giản. */}
      <TextInput
        style={styles.input}
        value={startDate}
        onChangeText={setStartDate}
        placeholder="YYYY-MM-DD (Mặc định: Hôm nay)"
      />

      <Button title={isEditing ? 'Lưu Thay Đổi' : 'Tạo Thói Quen'} onPress={handleSave} color="#4A90E2" />

      {/* Khoảng cách cuối trang */}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    minHeight: 40,
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  iconOption: {
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: '#eee',
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  frequencyOption: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: '#eee',
  },
  frequencySelected: {
    backgroundColor: '#4A90E2',
  },
  frequencyText: {
    color: '#333',
    fontWeight: '500',
  },
  frequencyTextSelected: {
    color: '#fff',
  },
});