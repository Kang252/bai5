import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Trang Chủ</ThemedText>
      <ThemedText style={styles.text}>
        Chào mừng đến với ứng dụng React Native/Expo Router của bạn!
      </ThemedText>
      <ThemedText style={styles.text}>
        Đây là nội dung của Tab "Trang chủ".
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