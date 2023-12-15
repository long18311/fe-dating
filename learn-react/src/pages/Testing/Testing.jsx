import {useState} from "react"
import Swal from 'sweetalert2';

export default function Testing(){
    const [userData, setUserData] = useState({ name: '', email: '', gender: '', hobbies: [] });

    const showSuccessAlert = () => {
        Swal.fire({
            icon: 'success',
            title: '  thành công!',
            text: 'Chào mừng bạn đã  .',
            customClass: {
                popup: 'custom-popup-class', // Sử dụng lớp CSS cho kích thước popup
                content: 'custom-content-class', // Sử dụng lớp CSS cho nội dung hộp thoại
            },
        });
    };
    const showErrorAlert = () => {
        Swal.fire({
            icon: 'error',
            title: '  thất bại',
            text: 'Vui lòng thử lại sau.',
        });
    };
    const showWarningAlert = () => {
        Swal.fire({
            icon: 'warning',
            title: 'Cảnh báo!',
            text: 'Hãy cẩn thận và kiểm tra thông tin của bạn trước khi tiếp tục.',
        });
    };
    const showInfoAlert = () => {
        Swal.fire({
            icon: 'info',
            title: 'Thông tin!',
            text: 'Dưới đây là một số thông tin quan trọng.',
        });
    };
    const showConfirmAlert = () => {
        Swal.fire({
            icon: 'question',
            title: 'Xác nhận!',
            text: 'Bạn có chắc chắn muốn thực hiện hành động này?',
            showCancelButton: true,
            confirmButtonText: 'Đồng ý',
            cancelButtonText: 'Hủy',
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire('Thực hiện!', 'Hành động đã được thực hiện.', 'success');
            }
        });
    };
    const showFormAlert = () => {
        Swal.fire({
            title: 'Nhập thông tin',
            html: `
        <input id="swal-input-name" class="swal2-input" placeholder="Tên" />
        <input id="swal-input-email" class="swal2-input" placeholder="Email" />
        <div>
          <label>Giới tính:</label>
          <input type="radio" name="gender" value="Nam"> Nam
          <input type="radio" name="gender" value="Nữ"> Nữ
        </div>
        <div>
          <label>Sở thích:</label>
          <input type="checkbox" name="hobbies" value="Đọc sách"> Đọc sách
          <input type="checkbox" name="hobbies" value="Du lịch"> Du lịch
          <input type="checkbox" name="hobbies" value="Thể thao"> Thể thao
        </div>
      `,
            confirmButtonText: 'Xác nhận',
            focusConfirm: false,
            preConfirm: () => {
                const nameField = Swal.getPopup().querySelector('#swal-input-name');
                const emailField = Swal.getPopup().querySelector('#swal-input-email');
                const genderField = Swal.getPopup().querySelector('input[name="gender"]:checked');
                const hobbyFields = Swal.getPopup().querySelectorAll('input[name="hobbies"]:checked');

                if (!nameField || !emailField || !genderField || hobbyFields.length === 0) {
                    Swal.showValidationMessage('Vui lòng điền đầy đủ thông tin.');
                    return false;
                }

                const name = nameField.value;
                const email = emailField.value;
                const gender = genderField.value;
                //chuyển đổi một NodeList (một danh sách các phần tử HTML) thành một mảng JavaScript thông qua Array.from()
                const hobbies = Array.from(hobbyFields).map((checkbox) => checkbox.value);

                if (!/\S+@\S+\.\S+/.test(email)) {
                    Swal.showValidationMessage('Vui lòng nhập địa chỉ email hợp lệ.');
                    return false;
                }

                return { name, email, gender, hobbies };
            },
        }).then((result) => {
            if (result.isConfirmed) {
                const { name, email, gender, hobbies } = result.value;
                setUserData({ name, email, gender, hobbies });
                Swal.fire('Thông tin người dùng', `Tên: ${name}\nEmail: ${email}\nGiới tính: ${gender}\nSở thích: ${hobbies.join(', ')}`, 'info');
            }
        });
    };

    const signin =  ()=>{
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })
        Toast.fire({
            icon: 'success',
            title: 'Signed in successfully'
        })
    }
    return (
        <div className="App">
            <h1>Ứng dụng React</h1>
            <button onClick={showSuccessAlert}>  thành công</button>
            <button onClick={showErrorAlert}>  thất bại</button>
            <button onClick={showWarningAlert}>  cảnh báo</button>
            <button onClick={showInfoAlert}>  thông báo</button>
            <button onClick={showConfirmAlert }>  xác nhận</button>

            <button onClick={signin}>customBackground</button>

            <button onClick={showFormAlert}>Hiển thị Form</button>
            {userData.name && userData.email && (
                <div>
                    <h2>Thông tin đã nhập:</h2>
                    <p>Tên: {userData.name}</p>
                    <p>Email: {userData.email}</p>
                    <p>Giới tính: {userData.gender}</p>
                    <p>Sở thích: {userData.hobbies.join(', ')}</p>
                </div>
            )}
        </div>
    );
}