// File: src/context/HabitContext.js
import React, { createContext, useState, useContext } from 'react';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid'; 
import { getTodayDateKey } from '../utils/dateUtils';

// --- Hàm Helper (Streak Logic) ---
const getPreviousDayKey = (dateKey) => {
    const previous = new Date(dateKey);
    previous.setDate(previous.getDate() - 1);
    return previous.toISOString().split('T')[0];
}

const calculateStreak = (completionHistory, todayKey) => {
    let currentStreak = 0;
    let longestStreak = 0;
    let totalCompletedDays = 0;
    
    // 1. Tính Current Streak
    let consecutiveDays = 0;
    let checkDate = new Date(todayKey);
    
    // Nếu hôm nay không hoàn thành, streak chỉ có thể là 0, 
    // nhưng ta vẫn check ngày hôm qua để xem streak có bị đứt không.
    if (!completionHistory[todayKey]) {
        checkDate = new Date(getPreviousDayKey(todayKey));
    }
    
    let isTodayCheck = true;
    while (true) {
        const dateKey = checkDate.toISOString().split('T')[0];
        
        // Dừng nếu chưa đến ngày bắt đầu tracking
        if (new Date(dateKey) < new Date(Object.keys(completionHistory).sort()[0] || todayKey)) {
            break;
        }

        if (completionHistory[dateKey]) {
            consecutiveDays++;
        } else if (isTodayCheck && !completionHistory[todayKey]) {
            // Nếu hôm nay là ngày duy nhất bị miss, streak là 0, thoát
            consecutiveDays = 0;
            break;
        } else {
            // Dừng nếu chuỗi bị đứt (ngày hôm trước đó không hoàn thành)
            break;
        }
        
        checkDate.setDate(checkDate.getDate() - 1);
        isTodayCheck = false;
    }
    currentStreak = consecutiveDays;

    // 2. Tính Longest Streak và Total Completed Days
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
            
            // Tính toán khoảng cách ngày
            const oneDay = 24 * 60 * 60 * 1000;
            if (currentDay.getTime() - previousDay.getTime() === oneDay) {
                tempStreak++;
            } else {
                tempStreak = 1;
            }
            if (tempStreak > maxStreak) {
                maxStreak = tempStreak;
            }
        }
    }
    
    // Đảm bảo longestStreak lớn hơn hoặc bằng currentStreak
    longestStreak = Math.max(maxStreak, currentStreak);

    return { currentStreak, longestStreak, totalCompletedDays };
}

// Dữ liệu thói quen giả
const MOCK_HABITS = [
    {
        id: '1', title: 'Uống đủ nước', icon: 'droplet', description: 'Uống 8 ly nước mỗi ngày',
        targetFrequency: 'daily', startDate: '2025-11-01',
        colorTheme: '#4A90E2', 
        currentStreak: 0, longestStreak: 0, totalCompletedDays: 0,
        completionHistory: {
            '2025-11-17': true, 
            '2025-11-18': true, 
            '2025-11-19': true, 
        }
    },
    {
        id: '2', title: 'Đọc sách', icon: 'book', description: 'Đọc 30 phút trước khi ngủ',
        targetFrequency: 'daily', startDate: '2025-10-15',
        colorTheme: '#50E3C2', 
        currentStreak: 0, longestStreak: 0, totalCompletedDays: 0,
        completionHistory: {
            '2025-11-15': true,
            '2025-11-16': true,
            '2025-11-18': true,
        }
    },
];

const HabitContext = createContext();

export const HabitProvider = ({ children }) => { 
    const [habits, setHabits] = useState(MOCK_HABITS); 

    const addHabit = (newHabitData) => {
        const newHabit = {
            id: uuidv4(), 
            ...newHabitData,
            currentStreak: 0,
            longestStreak: 0,
            totalCompletedDays: 0,
            completionHistory: {},
            startDate: new Date(newHabitData.startDate || new Date()).toISOString().split('T')[0], 
        };
        setHabits(prevHabits => [...prevHabits, newHabit]);
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

                    if (isCompleted) {
                        delete newCompletionHistory[dateKey]; 
                    } else {
                        newCompletionHistory[dateKey] = true; 
                    }

                    // Tính toán lại Streaks (FR-6)
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
        <HabitContext.Provider value={{ habits, addHabit, updateHabit, deleteHabit, toggleCompletion, calculateStreak }}>
            {children}
        </HabitContext.Provider>
    );
};

export const useHabits = () => {
    return useContext(HabitContext);
};