// File: app/(tabs)/analytics.js
import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit'; 
import { useHabits } from '../../src/context/HabitContext';

const screenWidth = Dimensions.get('window').width;

const calculateOverallCompletion = (habits) => {
  if (!habits || habits.length === 0) return 0;
  
  let totalTrackedDays = 0;
  let totalCompletedDays = 0;

  habits.forEach(habit => {
    // Tính số ngày từ ngày bắt đầu đến hôm nay
    const startDate = new Date(habit.startDate);
    const today = new Date();
    const diffTime = Math.abs(today - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 

    totalTrackedDays += diffDays;
    totalCompletedDays += habit.totalCompletedDays;
  });

  if (totalTrackedDays === 0) return 0;
  // FR-9: Completion percentage
  return Math.round((totalCompletedDays / totalTrackedDays) * 100); 
};

const generateDailyCompletionData = (habits) => {
    // Lấy tổng số lần hoàn thành trong 7 ngày qua
    const data = Array(7).fill(0); 
    const labels = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        const dateKey = date.toISOString().split('T')[0];
        
        labels.push(date.getDate()); 
        
        habits.forEach(habit => {
            if (habit.completionHistory[dateKey]) {
                data[6 - i] += 1;
            }
        });
    }

    // FR-10: Progress Graph
    return { labels, datasets: [{ data, color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})` }] };
};


export default function AnalyticsScreen() {
  const { habits } = useHabits();
  
  const overallCompletion = calculateOverallCompletion(habits);
  const chartData = generateDailyCompletionData(habits);
  
  // FR-9: Most consistent habits
  const mostConsistent = [...habits]
    .sort((a, b) => b.totalCompletedDays - a.totalCompletedDays)
    .slice(0, 3);


  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>📊 Báo Cáo & Phân Tích</Text>

      {/* FR-9: Completion Percentage */}
      <View style={styles.card}>
        <Text style={styles.statLabel}>Hoàn Thành Chung:</Text>
        <Text style={styles.statValue(overallCompletion)}>{overallCompletion}%</Text>
      </View>
      
      {/* FR-9: Streak Performance */}
      <View style={styles.card}>
        <Text style={styles.statLabel}>Chuỗi Ngày Dài Nhất (Tổng):</Text>
        <Text style={styles.statValue(100)}>{habits.reduce((max, h) => Math.max(max, h.longestStreak), 0)} ngày</Text>
      </View>

      {/* FR-9: Most Consistent Habits */}
      <View style={styles.card}>
        <Text style={styles.statLabel}>Thói Quen Kiên Trì Nhất:</Text>
        {mostConsistent.map((h, index) => (
            <Text key={h.id} style={styles.listItem}>
                {index + 1}. {h.title} ({h.totalCompletedDays} ngày)
            </Text>
        ))}
      </View>

      {/* FR-10: Progress Graph */}
      <Text style={styles.chartTitle}>Tiến Độ Hoàn Thành Hàng Ngày (7 ngày qua)</Text>
      <LineChart
        data={chartData}
        width={screenWidth - 40} 
        height={220}
        chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0, 
            color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
                borderRadius: 16
            },
            propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#4A90E2'
            }
        }}
        bezier
        style={styles.chart}
      />
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#eee',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  statLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  statValue: (percentage) => ({
    fontSize: 28,
    fontWeight: 'bold',
    color: percentage >= 70 ? '#50E3C2' : (percentage >= 40 ? '#F5A623' : '#D0021B'),
    marginTop: 5,
  }),
  listItem: {
    fontSize: 15,
    paddingVertical: 2,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginTop: 15,
    marginBottom: 10,
    color: '#333',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
    marginHorizontal: 10,
  },
});