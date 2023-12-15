import Swal from "sweetalert2";

const showInfoAlert = (title,text) => {
    Swal.fire({
        icon: 'info',
        title: title,
        text:  text,
        customClass: {
            popup: 'your-custom-class', // Thay "your-custom-class" bằng tên lớp CSS bạn muốn sử dụng
        },
    });
};
export  default showInfoAlert