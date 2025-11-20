// Tệp: hooks/useColorScheme.ts

import { useColorScheme as useRNColorScheme } from 'react-native';

/**
 * Lấy ra chế độ màu hiện tại của hệ thống (light hoặc dark).
 *
 * @returns 'light' | 'dark' | undefined
 */
export function useColorScheme() {
  return useRNColorScheme();
}