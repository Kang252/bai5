// File: app/(tabs)/index.js
import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useHabits } from '../../src/context/HabitContext'; 
import HabitListItem from '../../src/components/HabitListItem';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { router } from 'expo-router'; 
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HabitListScreen() {
  const { habits } = useHabits();

  const navigateToCreateHabit = () => {
    router.push('create-edit-habit'); 
  };
  
  const navigateToEditHabit = (habitId) => {
    router.push({ 
        pathname: 'create-edit-habit', 
        params: { habitId } 
    });
  };

  return (
    <SafeAreaView style={styles.safeContainer} edges={['top', 'bottom']}>
        <View style={styles.container}>
            <Text style={styles.header}>Thói Quen Của Tôi</Text>
            
            <FlatList
                data={habits}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                <HabitListItem 
                    habit={item} 
                    onPress={navigateToEditHabit} // onLongPress của ListItem gọi hàm này
                />
                )}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="bulb-outline" size={50} color="#ccc" />
                        <Text style={styles.emptyText}>Bạn chưa có thói quen nào. Hãy thêm cái mới!</Text>
                    </View>
                )}
            />

            <TouchableOpacity 
                style={styles.addButton}
                onPress={navigateToCreateHabit}
            >
                <Ionicons name="add" size={30} color="#fff" />
            </TouchableOpacity>
        </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    container: {
        flex: 1,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        paddingHorizontal: 15,
        paddingBottom: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    listContent: {
        paddingBottom: 100,
        paddingTop: 10,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 50,
        marginTop: 50,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        marginTop: 10,
        textAlign: 'center',
    },
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