// Tệp: hooks/useThemeColor.ts

import { Colors } from '@/constants/Colors';
import { useColorScheme } from 'react-native'; // Hook có sẵn trong React Native/Expo

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

/**
 * Hook tùy chỉnh để chọn màu dựa trên chế độ sáng/tối của hệ thống.
 * @param props Các màu tùy chỉnh cho chế độ sáng và tối (lightColor, darkColor)
 * @param colorName Tên màu được định nghĩa trong constants/Colors.ts
 * @returns Mã màu (string)
 */
export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: ThemeColor
) {
  const theme = useColorScheme() ?? 'light'; // Lấy chế độ màu của hệ thống (light hoặc dark)
  const colorFromProps = props[theme];

  // Nếu props có định nghĩa màu, ưu tiên sử dụng màu đó
  if (colorFromProps) {
    return colorFromProps;
  } else {
    // Nếu không, sử dụng màu mặc định từ constants/Colors.ts
    return Colors[theme][colorName];
  }
}