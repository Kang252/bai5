// Tệp: app/_layout.tsx (Đã sửa đổi)

import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { useColorScheme } from 'react-native';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // Đảm bảo nhận cả 'loaded' VÀ 'error' từ useFonts
  const [loaded, error] = useFonts({
    Ionicons: require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf'),
  });

  // 1. Xử lý khi có lỗi tải font
  useEffect(() => {
    if (error) {
      console.error("Lỗi tải Font:", error);
      // Khi có lỗi, ứng dụng vẫn tiến hành và ẩn splash screen.
      // Dù font bị lỗi, ứng dụng vẫn chạy và hiển thị màn hình chính.
      SplashScreen.hideAsync();
      // throw error; // Bỏ comment này nếu bạn muốn thấy màn hình lỗi màu đỏ chi tiết
    }
  }, [error]);

  // 2. Ẩn màn hình chờ khi TẢI THÀNH CÔNG (hoặc khi có lỗi đã được xử lý)
  useEffect(() => {
    // Ẩn splash screen nếu đã tải xong HOẶC nếu đã có lỗi (error)
    if (loaded || error) { 
      SplashScreen.hideAsync();
    }
  }, [loaded, error]); // Thêm error vào dependency array

  // 3. Giữ màn hình chờ hiển thị nếu chưa tải xong và chưa có lỗi
  if (!loaded && !error) {
    return null;
  }

  // 4. Render Stack Navigator
  return (
    // ... Phần render Stack của bạn ...
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}