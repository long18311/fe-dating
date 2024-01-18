import "../Contentpost/style.css"
import theme from "../fb-icons/theme.svg"
import {useEffect, useState} from "react";
import Swal from "sweetalert2";
import showErrorAlert from "../SwalAlert/showErrorAlert.jsx";
import axios from "axios";

export default function  ContentVerify(props){
    // eslint-disable-next-line react/prop-types
    const { userProfile,setProfile } = props;
    const [userLogged, setUserLogged] = useState({});
    const [cccd, setCccd] = useState({});
    const [file, setFile] = useState(null);

    const isPostButtonActive = file && file.type.match('image.*');
    useEffect(() => {
        setUserLogged(userProfile);
    }, []);
    const isImageValid = (file) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = URL.createObjectURL(file);
        });
    }
    return (
        <div>
            <div className="container-p shadow-lg ml-5">
                <div className="wrapper-p">
                    <section className="post-p">
                        <header>Xác minh</header>
                        <div className="formab">


                            <div className="options">

                                <ul className="list">
                                    <li><img onClick={() =>{
                                        // Tạo một input type='file' ẩn
                                        console.log('handle')
                                        const input = document.createElement('input');
                                        input.type = 'file';
                                        input.accept = 'image/*'; // Chỉ chấp nhận file ảnh
                                        input.onchange = async (e) => {
                                            const file = e.target.files[0];
                                            if (!file) {
                                                // console.log('Không có file nào được chọn.');
                                                return;
                                            }

                                            // Kiểm tra MIME type của file
                                            if (file.type.match('image.*')) {
                                                const isValidImage = await isImageValid(e.target.files[0]);
                                                if (!isValidImage) {
                                                    showErrorAlert("error", "Lỗi", "File không phải là ảnh hợp lệ.");
                                                    return;
                                                }
                                                setFile(file);
                                            } else {
                                                console.log('File không phải là ảnh.');
                                            }
                                        };

                                        // Kích hoạt click event
                                        input.click();
                                    }} src={theme} alt=""/></li>

                                </ul>
                                {file ? (
                                    <div className="w-full p-2 border border-gray-200 rounded-md">
                                        <p className="text-sm truncate">{file.name}</p>
                                    </div>
                                ) : (
                                    <p>ảnh</p>
                                )}
                            </div>
                            <button type='button' disabled={!isPostButtonActive}  onClick={ async ()=>{
                                if(!isPostButtonActive){return}
                                Swal.fire({
                                    title: 'Vui lòng chờ trong giây lát',
                                    allowOutsideClick: false,
                                    showConfirmButton: false,
                                    onBeforeOpen: () => {
                                        Swal.showLoading(); // Hiển thị biểu tượng spinner từ Font Awesome
                                    },
                                    // Thêm một biểu tượng spinner từ Font Awesome
                                    html: '<i class="fa fa-spinner fa-spin fa-2x"></i>',
                                });
                                const formData = new FormData();
                                formData.append("image", file);
                                await axios.post('https://api.fpt.ai/vision/idr/vnm', formData, {
                                    headers: {
                                        'Content-Type': 'multipart/form-data',
                                        'api-key': 'U95uyYgr9Df6KCS1uLoH78v3C883mS3C',
                                    },
                                }).then(
                                    (res)=>{
                                        Swal.close();
                                        setCccd(res.data[0])
                                        Swal.fire('thành công', "thành công", 'success');
                                    }
                                ).catch((error) => {
                                    Swal.close();
                                    console.log(error)
                                    Swal.fire('Lỗi!', error, 'error');
                                });



                            }}>Post</button>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    )
}