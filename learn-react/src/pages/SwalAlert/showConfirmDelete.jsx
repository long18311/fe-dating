import Swal from "sweetalert2";
export default function showConfirmDelete(title, text, confirm) {
    return new Promise((resolve, reject) => {
        Swal.fire({
            title: title,
            text: text,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: confirm
        }).then((result) => {
            if (result.isConfirmed) {
                resolve(); // Người dùng đã xác nhận, tiếp tục với xóa
            } else {
                reject(); // Người dùng đã hủy xóa
            }
        });
    });
}
