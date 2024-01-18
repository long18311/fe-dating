import Swal from "sweetalert2";
export  default function showSuccessAlert(message){
    Swal.fire({
        icon: 'success',
        title: '  Thành công!',
        text: message,
        customClass: {
            popup: 'custom-popup-class', // Sử dụng lớp CSS cho kích thước popup
            content: 'custom-content-class', // Sử dụng lớp CSS cho nội dung hộp thoại
        },
    });
}

