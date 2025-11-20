// File: src/services/NotificationService.js
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Cấu hình hiển thị thông báo khi ứng dụng đang mở
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Xin quyền thông báo
export async function registerForPushNotificationsAsync() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    console.log('Failed to get push token for push notification!');
    return;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
}

// FR-7: Lên lịch nhắc nhở hàng ngày theo giờ người dùng chọn
export async function scheduleDailyReminder(habitId, title, hour, minute, message) {
    const identifier = `daily-${habitId}`;
    
    // Hủy thông báo cũ nếu có để tránh trùng lặp
    await Notifications.cancelScheduledNotificationAsync(identifier);

    await Notifications.scheduleNotificationAsync({
        identifier,
        content: {
            title: `🔔 Nhắc nhở: ${title}`,
            body: message || "Đừng quên thực hiện thói quen của bạn nhé!",
            sound: 'default',
        },
        trigger: {
            hour: hour,
            minute: minute,
            repeats: true, // Lặp lại hàng ngày
        },
    });
    console.log(`Đã lên lịch nhắc ${title} lúc ${hour}:${minute}`);
}

// FR-8: Smart Reminder - Nhắc lúc 8 PM nếu chưa hoàn thành
// (Lưu ý: Đây là setup cơ bản, để check trạng thái thực tế cần Background Task phức tạp hơn)
export async function scheduleSmartReminder(habitId, title) {
    const identifier = `smart-${habitId}`;
    
    await Notifications.cancelScheduledNotificationAsync(identifier);

    await Notifications.scheduleNotificationAsync({
        identifier,
        content: {
            title: `🚨 Kiểm tra cuối ngày: ${title}`,
            body: "Đã 8 giờ tối rồi, bạn đã hoàn thành thói quen này chưa?",
            sound: 'default',
        },
        trigger: {
            hour: 20, // 8 PM
            minute: 0,
            repeats: true,
        },
    });
    console.log(`Đã lên lịch Smart Reminder cho ${title} lúc 20:00`);
}

// Hủy tất cả thông báo của một thói quen (khi xóa hoặc tắt nhắc nhở)
export async function cancelHabitNotifications(habitId) {
    await Notifications.cancelScheduledNotificationAsync(`daily-${habitId}`);
    await Notifications.cancelScheduledNotificationAsync(`smart-${habitId}`);
}