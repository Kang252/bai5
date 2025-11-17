// app/add.tsx
import { View, Text } from 'react-native';

// Đây là màn hình AddNoteScreen 
export default function AddNote() {
  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#fff' }}>
      <Text>Đây là màn hình thêm ghi chú.</Text>
      {/* Chúng ta sẽ thêm TextInput [cite: 16] và nút Save [cite: 21] ở đây */}
    </View>
  );
}