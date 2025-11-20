// File: src/services/NotificationService.js
import * as Notifications from 'expo-notifications';

// 1. Yêu cầu quyền truy cập (Quan trọng)
export async function registerForPushNotificationsAsync() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    console.warn('Failed to get push token for push notification!');
    return;
  }
}

// 2. Lên lịch thông báo Hàng ngày (FR-7)
export async function scheduleDailyReminder(habitId, title, time = { hour: 7, minute: 0 }, message = "Đừng quên thói quen này nhé!") {
    // Hủy bỏ thông báo cũ nếu có
    await Notifications.cancelScheduledNotificationAsync(`daily-${habitId}`);

    // Lên lịch thông báo lặp lại hàng ngày
    await Notifications.scheduleNotificationAsync({
        identifier: `daily-${habitId}`,
        content: {
            title: `🔔 Nhắc nhở: ${title}`,
            body: message,
            sound: 'default',
        },
        trigger: {
            hour: time.hour,
            minute: time.minute,
            repeats: true, // Lặp lại hàng ngày
        },
    });
    console.log(`Scheduled daily reminder for ${title} at ${time.hour}:${time.minute}`);
}

// 3. Lên lịch Nhắc nhở Thông minh (Smart Reminder - FR-8)
export async function scheduleSmartReminder(habitId, title, message = "8 PM rồi, bạn đã hoàn thành thói quen này chưa?") {
    // Hủy bỏ thông báo cũ nếu có
    await Notifications.cancelScheduledNotificationAsync(`smart-${habitId}`);

    // Lên lịch thông báo 8 PM hàng ngày (20:00)
    await Notifications.scheduleNotificationAsync({
        identifier: `smart-${habitId}`,
        content: {
            title: `🚨 NHẮC NHỞ KHẨN: ${title}`,
            body: message,
            sound: 'default',
        },
        trigger: {
            hour: 20, // 8 PM
            minute: 0,
            repeats: true,
        },
    });
    console.log(`Scheduled smart reminder for ${title} at 20:00`);
}

// 4. Hủy tất cả thông báo liên quan đến một thói quen
export async function cancelHabitNotifications(habitId) {
    await Notifications.cancelScheduledNotificationAsync(`daily-${habitId}`);
    await Notifications.cancelScheduledNotificationAsync(`smart-${habitId}`);
}