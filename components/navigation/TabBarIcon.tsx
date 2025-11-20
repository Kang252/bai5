// Tệp: components/navigation/TabBarIcon.tsx

import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { type ComponentProps } from 'react';

// Định nghĩa props cho component TabBarIcon
type TabBarIconProps = ComponentProps<typeof Ionicons> & {
  color: string;
};

export function TabBarIcon({ style, ...rest }: TabBarIconProps) {
  // Biểu tượng sẽ được truyền dưới dạng props.name, color, và size
  return <Ionicons size={28} style={[{ marginBottom: -3 }, style]} {...rest} />;
}