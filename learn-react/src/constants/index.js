
export const ACCESS_TOKEN = "ACCESS_TOKEN"
export const URL = "http://localhost:8080"

export const formatTimeVN = (timestamp) => {
    const messageDate = new Date(timestamp);
    const currentDate = new Date();

    // Đặt thời gian hiện tại về nửa đêm để tính sự khác biệt ngày một cách chính xác
    const startOfCurrentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    const startOfMessageDate = new Date(messageDate.getFullYear(), messageDate.getMonth(), messageDate.getDate());

    const differenceInTime = startOfCurrentDate - startOfMessageDate;
    const differenceInDays = Math.floor(differenceInTime / (1000 * 60 * 60 * 24));
    const differenceInWeeks = differenceInDays / 7;

    const monthNames = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];

    if (differenceInDays === 0) {
        // Hôm nay
        return `${messageDate.getHours()}:${String(messageDate.getMinutes()).padStart(2, '0')} Hôm nay`;
    } else if (differenceInDays === 1) {
        // Hôm qua
        return `${messageDate.getHours()}:${String(messageDate.getMinutes()).padStart(2, '0')} Hôm qua`;
    } else if (differenceInDays < 7) {
        // Ít hơn một tuần trước
        return `${differenceInDays} Ngày trước`;
    } else if (differenceInWeeks < 4) {
        // Ít hơn một tháng trước
        return `${Math.floor(differenceInWeeks)} Tuần trước`;
    } else if (differenceInDays < 365) {
        // Ít hơn một năm trước
        return `${monthNames[messageDate.getMonth()]} Ngày ${messageDate.getDate()}`;
    } else {
        // Hơn một năm trước
        return `${monthNames[messageDate.getMonth()]} Ngày ${messageDate.getDate()}, năm ${messageDate.getFullYear()}`;
    }
};

export const APP_ID = 1799572626
export const SERVER_SECRET ="208a7defd78ebaa2b9caa1c40f9ac8cd"
export const KIT_TOKEN = "eb0b4c105e02bcee6e537a0987d8f5a8b3778c3d3a49ac853a4e86d67af25562"


