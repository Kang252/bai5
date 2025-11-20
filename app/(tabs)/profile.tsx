import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function ProfileScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Hồ Sơ Người Dùng</ThemedText>
      <ThemedText style={styles.text}>
        Đây là nơi thông tin hồ sơ của bạn sẽ hiển thị.
      </ThemedText>
      <ThemedText style={styles.text}>
        Bạn có thể thêm các chi tiết người dùng và tùy chọn tại đây.
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    marginTop: 10,
    textAlign: 'center',
  },
});