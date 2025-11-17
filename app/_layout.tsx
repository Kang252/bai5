// app/_layout.tsx

import { Stack, SplashScreen } from 'expo-router'; // 1. Import SplashScreen
import { NotesProvider } from '@/lib/context/NotesContext';
import { Platform, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font'; // 2. Import useFonts
import { useEffect } from 'react'; // 3. Import useEffect

// 4. Ngăn màn hình splash tự động ẩn đi
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  
  // 5. Tải font chữ (quan trọng để icon hiển thị đúng)
  const [fontsLoaded, fontError] = useFonts({
    ...Ionicons.font,
  });

  // 6. Sử dụng useEffect để ẩn màn hình splash khi fonts đã tải
  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Ẩn splash screen
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // 7. Nếu fonts chưa tải xong, chưa render gì cả (splash screen vẫn hiện)
  if (!fontsLoaded && !fontError) {
    return null;
  }

  // 8. Khi fonts đã sẵn sàng, render ứng dụng
  return (
    <NotesProvider>
      <Stack>
        <Stack.Screen
          name="index" // file: app/index.tsx
          options={{
            title: 'Ghi chú',
            headerRight: () => (
              <Link href="/add" asChild>
                <TouchableOpacity>
                  <Ionicons 
                    name={Platform.OS === 'ios' ? 'add-circle' : 'add'} 
                    size={28} 
                    color="#007AFF" />
                </TouchableOpacity>
              </Link>
            ),
          }}
        />
        
        <Stack.Screen
          name="add" // file: app/add.tsx
          options={{
            title: 'Ghi chú mới',
            presentation: 'modal', 
          }}
        />

        <Stack.Screen
          name="edit/[id]" // file: app/edit/[id].tsx
          options={{
            title: 'Chỉnh sửa',
          }}
        />
      </Stack>
    </NotesProvider>
  );
}