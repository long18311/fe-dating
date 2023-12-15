import "../Contentpost/style.css"
import logo from "../fb-icons/logo.png"
import emoji from "../fb-icons/emoji.svg"
import tag from "../fb-icons/tag.svg"
import theme from "../fb-icons/theme.svg"
import {useEffect, useState} from "react";
import axiosClient from "../../apis/AxiosClient.js";
import Swal from "sweetalert2";

export default function  Contentpost(){
    const [userLogged, setUserLogged] = useState({});
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState("");
    const [textAreaContent, setTextAreaContent] = useState("");
    const isPostButtonActive = file && file.type.match('image.*') && textAreaContent.length > 0;
    useEffect(() => {
        // luồng 1
         axiosClient.get("/userProfile").then((res) => {
             setUserLogged(res);
             console.log(res)
         })




    }, []);
    return (
        <div>
            <div className="container-p shadow-lg ml-5">
                <div className="wrapper-p">
                    <section className="post-p">
                        <header>Create Post</header>
                        <form action="#">
                            <div className="content">
                                <img className="profile-photo" src={userLogged.avatar} alt=""/>
                                    <div className="details">
                                        <p>{`${userLogged.lastname} ${userLogged.firstname}`
                                        }</p>
                                        <div className="privacy">
                                            <i className="fas fa-globe-asia"></i>
                                            <span className={"ml-2"}>public</span>

                                        </div>
                                    </div>
                            </div>
                            <input
                                maxLength="300"
                                placeholder="Title"
                                required
                                onChange={(e) => setTitle(e.target.value)}
                            ></input>
                            <textarea
                                maxLength="4000"
                                placeholder="What's on your mind"
                                required
                                onChange={(e) => setTextAreaContent(e.target.value)}
                            ></textarea>
                            <div className="theme-omoji">
                                {/*{file && (*/}
                                {/*    <div className="flex justify-center items-center h-full">*/}
                                {/*        <img className="mx-auto my-auto rounded-full border-2 p-1"*/}
                                {/*             src = {URL.createObjectURL(file)}*/}
                                {/*             alt="profile"*/}
                                {/*        />*/}
                                {/*        </div>*/}

                                {/*)}*/}

                            </div>
                            <div className="options">
                                {file ? (
                                    <div className="w-full p-2 border border-gray-200 rounded-md">
                                        <p className="text-sm truncate">{file.name}</p>
                                    </div>
                                ) : (
                                    <p>Add to your post</p>
                                )}
                                <ul className="list">
                                    <li><img onClick={() =>{
                                        // Tạo một input type='file' ẩn
                                        console.log('handle')
                                        const input = document.createElement('input');
                                        input.type = 'file';
                                        input.accept = 'image/*'; // Chỉ chấp nhận file ảnh
                                        input.onchange = (e) => {
                                            const file = e.target.files[0];
                                            if (!file) {
                                                // console.log('Không có file nào được chọn.');
                                                return;
                                            }

                                            // Kiểm tra MIME type của file
                                            if (file.type.match('image.*')){
                                                setFile(file);
                                            }else {
                                                console.log('File không phải là ảnh.');
                                            }
                                        };

                                        // Kích hoạt click event
                                        input.click();
                                    }} src={theme} alt=""/></li>
                                    {/*<li><img src={tag} alt=""/></li>*/}
                                    {/*<li><img src={emoji} alt=""/></li>*/}
                                    {/*<li><img src="../fb-icons/mic.svg" alt=""/></li>*/}
                                    {/*<li><img src="../fb-icons/more.svg" alt=""/></li>*/}
                                </ul>
                            </div>
                            <button disabled={!isPostButtonActive} onClick={()=>{
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
                                formData.append("title",title)
                                formData.append("content", textAreaContent);
                                formData.append("image", file);
                                axiosClient.post('/post', formData, {
                                    headers: {
                                        'Content-Type': 'multipart/form-data',
                                    },
                                }).then(
                                    (res)=>{
                                        Swal.close();
                                        Swal.fire('Thành công!', res, 'success');
                                    }
                                ).catch((error) => {
                                    Swal.close();
                                    console.log(error)
                                    Swal.fire('Lỗi!', error, 'error');
                                });

                            }}>Post</button>
                        </form>
                    </section>

                </div>
            </div>
        </div>
    )
}