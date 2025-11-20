// Tệp: app/_layout.tsx

import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { useColorScheme } from 'react-native'; // Hoặc '@/hooks/useColorScheme' nếu bạn muốn dùng hook đã tạo

// Ngăn màn hình chờ tự động ẩn cho đến khi chúng ta sẵn sàng.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme(); // Lấy chế độ màu hiện tại

  // 1. Tải phông chữ Ionicons
  const [loaded] = useFonts({
    // Đường dẫn này được sử dụng để tải phông chữ Ionicons
    Ionicons: require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf'),
  });

  // 2. Quản lý Màn hình chờ (Splash Screen)
  useEffect(() => {
    if (loaded) {
      // Ẩn màn hình chờ sau khi phông chữ đã được tải
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    // Không render gì cho đến khi phông chữ được tải (màn hình chờ vẫn hiển thị)
    return null;
  }

  // 3. Render Stack Navigator (sau khi phông chữ đã tải)
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/*
        Layout này sẽ render Tab Navigator của chúng ta (app/(tabs)/_layout.tsx),
        sau đó là các màn hình Stack khác (nếu có).
      */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}