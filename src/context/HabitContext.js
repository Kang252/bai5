// File: src/context/HabitContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid'; 
import { getTodayDateKey } from '../utils/dateUtils';
import { registerForPushNotificationsAsync } from '../services/NotificationService';

// --- Hàm Helper (Streak Logic - Giữ nguyên) ---
const getPreviousDayKey = (dateKey) => {
    const previous = new Date(dateKey);
    previous.setDate(previous.getDate() - 1);
    return previous.toISOString().split('T')[0];
}

const calculateStreak = (completionHistory, todayKey) => {
    let currentStreak = 0;
    let longestStreak = 0;
    let totalCompletedDays = 0;
    
    let consecutiveDays = 0;
    let checkDate = new Date(todayKey);
    
    if (!completionHistory[todayKey]) {
        checkDate = new Date(getPreviousDayKey(todayKey));
    }
    
    let isTodayCheck = true;
    while (true) {
        const dateKey = checkDate.toISOString().split('T')[0];
        const historyDates = Object.keys(completionHistory).sort();
        
        if (historyDates.length === 0 || new Date(dateKey) < new Date(historyDates[0])) {
            break;
        }

        if (completionHistory[dateKey]) {
            consecutiveDays++;
        } else if (isTodayCheck && !completionHistory[todayKey]) {
            consecutiveDays = 0;
            break;
        } else {
            break;
        }
        
        checkDate.setDate(checkDate.getDate() - 1);
        isTodayCheck = false;
    }
    currentStreak = consecutiveDays;

    let completedDays = Object.keys(completionHistory).filter(day => completionHistory[day]).sort();
    totalCompletedDays = completedDays.length;

    let maxStreak = 0;
    let tempStreak = 0;
    
    if (completedDays.length > 0) {
        tempStreak = 1;
        maxStreak = 1;
        for (let i = 1; i < completedDays.length; i++) {
            const currentDay = new Date(completedDays[i]);
            const previousDay = new Date(completedDays[i-1]);
            const oneDay = 24 * 60 * 60 * 1000;
            if (currentDay.getTime() - previousDay.getTime() === oneDay) {
                tempStreak++;
            } else {
                tempStreak = 1;
            }
            if (tempStreak > maxStreak) maxStreak = tempStreak;
        }
    }
    longestStreak = Math.max(maxStreak, currentStreak);

    return { currentStreak, longestStreak, totalCompletedDays };
}

// Dữ liệu giả (SỬA: Dùng Emoji thay vì tên icon)
const MOCK_HABITS = [
    {
        id: '1', title: 'Uống đủ nước', icon: '💧', description: 'Uống 8 ly nước',
        targetFrequency: 'daily', startDate: '2025-11-01',
        colorTheme: '#4A90E2', 
        currentStreak: 0, longestStreak: 0, totalCompletedDays: 0,
        completionHistory: { '2025-11-17': true, '2025-11-18': true, '2025-11-19': true }
    },
];

const HabitContext = createContext();

export const HabitProvider = ({ children }) => { 
    const [habits, setHabits] = useState(MOCK_HABITS); 

    // Xin quyền thông báo khi App khởi động
    useEffect(() => {
        registerForPushNotificationsAsync();
    }, []);

    const addHabit = (newHabitData) => {
        const id = uuidv4(); // Tạo ID
        const newHabit = {
            id, 
            ...newHabitData,
            currentStreak: 0,
            longestStreak: 0,
            totalCompletedDays: 0,
            completionHistory: {},
            startDate: new Date(newHabitData.startDate || new Date()).toISOString().split('T')[0], 
        };
        setHabits(prevHabits => [...prevHabits, newHabit]);
        return id;
    };

    const updateHabit = (id, updatedData) => {
        setHabits(prevHabits => 
            prevHabits.map(habit => 
                habit.id === id ? { ...habit, ...updatedData } : habit
            )
        );
    };

    const deleteHabit = (id) => {
        setHabits(prevHabits => prevHabits.filter(habit => habit.id !== id));
    };

    const toggleCompletion = (habitId, date) => {
        const todayKey = getTodayDateKey();
        const dateKey = date || todayKey;

        setHabits(prevHabits => 
            prevHabits.map(habit => {
                if (habit.id === habitId) {
                    const isCompleted = habit.completionHistory[dateKey];
                    const newCompletionHistory = { ...habit.completionHistory };

                    if (isCompleted) delete newCompletionHistory[dateKey]; 
                    else newCompletionHistory[dateKey] = true; 

                    const { currentStreak, longestStreak, totalCompletedDays } = calculateStreak(newCompletionHistory, todayKey);
                    
                    return {
                        ...habit,
                        completionHistory: newCompletionHistory,
                        currentStreak,
                        longestStreak,
                        totalCompletedDays,
                    };
                }
                return habit;
            })
        );
    };

    return (
        <HabitContext.Provider value={{ habits, addHabit, updateHabit, deleteHabit, toggleCompletion }}>
            {children}
        </HabitContext.Provider>
    );
};

export const useHabits = () => useContext(HabitContext);