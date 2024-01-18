
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
export function splitFullName(fullName) {
    if (!fullName || typeof fullName !== 'string') {
        return {
            firstName: '',
            lastName: ''
        };
    }

    // Chuyển đổi chuỗi sang chữ thường và tách thành mảng các từ
    const words = fullName.toLowerCase().split(' ');

    // Lấy phần tử đầu tiên làm họ
    const firstName = words.shift();

    // Sử dụng hàm formatString để chuyển đổi chữ cái đầu của họ
    const formattedFirstName = formatString(firstName);

    // Phần còn lại là tên
    const lastName = words.join(' ');

    // Sử dụng hàm formatString để chuyển đổi chữ cái đầu của tên
    const formattedLastName = formatString(lastName);

    return {
        firstName: formattedFirstName,
        lastName: formattedLastName
    };
}
export function removeLocationWords(inputString) {
    if (!inputString || typeof inputString !== 'string') {
        return '';
    }

    // Mảng chứa các từ cần loại bỏ
    const locationWords =  ["Thành","phố", "Thị","xã", "Xóm", "Huyện", "Quận", "Xã", "Thị","trấn", "Phường" , "Tỉnh"];

    // Tách chuỗi thành mảng các từ
    const words = inputString.split(/\s+/);


    // Lọc ra các từ không chứa trong danh sách từ cần loại bỏ
    const filteredWords = words.filter(word => !locationWords.includes(word));

    // Kết hợp lại thành chuỗi kết quả
    const result = filteredWords.join(' ');

    // Loại bỏ trường hợp có khoảng trắng thừa ở đầu chuỗi
    return formatString(result).trim();
}

export function formatString(inputString) {
    if (!inputString || typeof inputString !== 'string') {
        return '';
    }

    // Chuyển đổi chuỗi sang chữ thường và tách thành mảng các từ
    const words = inputString.toLowerCase().split(' ');

    // Chuyển đổi chữ cái đầu của mỗi từ thành chữ hoa
    const formattedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));

    // Gắn kết các từ thành chuỗi kết quả
    const formattedString = formattedWords.join(' ');

    return formattedString;
}
export const TYPE_POSTS =["FirstDate","Ăn uống","Xem Phim","Du lịch","Thư giãn","Sôi động","Khác..."]

export const APP_ID = 1896039807
export const SERVER_SECRET ="10f1c3cf0ec9cdb37479118d8af85fd1"
export const KIT_TOKEN = "eb0b4c105e02bcee6e537a0987d8f5a8b3778c3d3a49ac853a4e86d67af25562"