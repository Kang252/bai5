// File: src/utils/dateUtils.js
export const getTodayDateKey = () => {
    // Trả về ngày hiện tại dưới dạng 'YYYY-MM-DD'
    return new Date().toISOString().split('T')[0];
};

export const formatDate = (date) => {
    // Hàm format ngày đơn giản, sử dụng trong màn hình Analytics
    return date.toISOString().split('T')[0];
};