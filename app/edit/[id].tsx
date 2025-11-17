// app/edit/[id].tsx
import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

// Đây là màn hình EditNoteScreen 
export default function EditNote() {
  // Lấy 'id' từ đường dẫn URL
  const { id } = useLocalSearchParams();

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#fff' }}>
      <Text>Chỉnh sửa ghi chú có ID: {id}</Text>
      {/* Chúng ta sẽ hiển thị dữ liệu cũ [cite: 36] ở đây */}
    </View>
  );
}