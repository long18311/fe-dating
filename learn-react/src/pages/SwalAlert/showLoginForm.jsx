import Swal from 'sweetalert2';

export  default function showLoginForm (){
    Swal.fire({
        title: "",
        html: `
         <input id="swal-input-account" class="swal2-input" placeholder="Account" />
        <input type="password"  id="swal-input-password" class="swal2-input" placeholder="Password" />
      `,
        confirmButtonText: 'Đăng nhập',
        focusConfirm: false,
        preConfirm: () => {
            const accountField = Swal.getPopup().querySelector('#swal-input-account').value;
            const passwordField = Swal.getPopup().querySelector('#swal-input-password').value;
            if (accountField.length===0 || passwordField=== 0) {
                Swal.showValidationMessage('Vui lòng điền đầy đủ thông tin.');
                return false;
            }
            return { accountField, passwordField};
        },
    }).then((result) => {
        if (result.isConfirmed) {
            console.log(result)
             }
    });
}
