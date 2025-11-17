// app/types.ts

/**
 * Đây là "khuôn mẫu" cho mỗi đối tượng ghi chú.
 * Dựa trên yêu cầu PDF:
 * - Tiêu đề [cite: 7]
 * - Nội dung (preview) [cite: 8, 20]
 * - Ngày tạo [cite: 10]
 * - Chúng ta cũng thêm id để định danh, và các trường cho yêu cầu 5 & 6.
 */
export type Note = {
  id: string;        // ID duy nhất cho mỗi ghi chú
  title: string;     // Tiêu đề [cite: 7]
  content: string;   // Nội dung [cite: 20]
  createdAt: string; // Ngày tạo, định dạng YYYY-MM-DD [cite: 10]
  tags?: string[];   // Cho Yêu cầu 5: Gắn tag [cite: 40]
  isPinned?: boolean;  // Cho Yêu cầu 6: Ghim [cite: 45]
};