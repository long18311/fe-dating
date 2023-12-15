import Swal from "sweetalert2";

export  default function showErrorAlert(icon,title,message){
        Swal.fire({
            icon: icon,
            title: title,
            text: message
        });
}