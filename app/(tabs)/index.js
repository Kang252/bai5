// File: app/(tabs)/index.js
import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useHabits } from '../../src/context/HabitContext'; // Điều chỉnh đường dẫn
import HabitListItem from '../../src/components/HabitListItem';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { router } from 'expo-router'; // Import router từ expo-router

// Tái sử dụng Styles từ Bước 4
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        padding: 20,
        backgroundColor: '#fff',
        paddingTop: 60, // Thêm padding cho thanh trạng thái
    },
    listContent: {
        paddingBottom: 100,
    },
    // ... (Thêm styles cho card, icon, title, streakText, statusCircle nếu chưa có)
    addButton: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        backgroundColor: '#4A90E2',
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
});


export default function HabitListScreen() {
  const { habits } = useHabits();

  // FR-3: Hiển thị danh sách cuộn
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Thói Quen Của Tôi</Text>
      
      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <HabitListItem 
            habit={item} 
            // Khi nhấn vào item sẽ điều hướng đến màn hình sửa thói quen
            onPress={() => router.push({ 
                pathname: 'create-edit-habit', 
                params: { habitId: item.id } 
            })}
          />
        )}
        contentContainerStyle={styles.listContent}
      />

      {/* Nút Thêm Thói Quen */}
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => router.push('create-edit-habit')} // Điều hướng đến màn hình tạo mới
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

// Cần cập nhật lại HabitListItem.js để nhận props onPress