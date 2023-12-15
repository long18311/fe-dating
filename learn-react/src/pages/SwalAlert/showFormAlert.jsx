import Swal from 'sweetalert2';

export  default function showFormAlert (message){
    Swal.fire({
        title: message.title,
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
            //setUserData({ name, email, gender, hobbies });
            Swal.fire('Thông tin người dùng', `Tên: ${name}\nEmail: ${email}\nGiới tính: ${gender}\nSở thích: ${hobbies.join(', ')}`, 'info');
        }
    });
    }
