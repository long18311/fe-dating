import React, {useEffect, useState} from 'react';
import HeaderDefaultLayout from "@/components/defaultlayout/HeaderDefaultLayout.jsx";
import {useParams} from "react-router-dom";
import axiosClient from "../../../apis/AxiosClient.js";
import Swal from "sweetalert2";
import {avatar} from "@material-tailwind/react";
import showErrorAlert from "../../../pages/SwalAlert/showErrorAlert.jsx";
import {TYPE_POSTS} from "../../../constants/index.js";

export default function PostEdit(){
    const {postId} = useParams();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [type, setType] = useState('');
    const [images, setImages] = useState([]);

    useEffect(() => {
        axiosClient.get(`/post/get/id/${postId}`).then((res) => {
            setContent(res.content)
            setTitle(res.title)
            setType(res.type)
            setImages(res.images)
            console.log(res);
        })
    }, []);
    const isImageValid = (file) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = URL.createObjectURL(file);
        });
    }

    // const handleImageChange = (e) => {
    //     setImage(e.target.files[0]);
    // }

    const handleSubmit = (e) => {
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
        axiosClient.put(`/post/${postId}?title=${title}&content=${content}&type=${type}`).then((res) => {
            setContent(res.content)
            setTitle(res.title)
            setType(res.type)
            setImages(res.images)
            console.log(res);
        })
    }

    return (
        <>
        <HeaderDefaultLayout/>
        <div className=" container mx-auto px-4">
            <form onSubmit={handleSubmit} className="space-y-4 mt-5">
                <div className="mb-4">
                    <select
                        id="type"
                        value={type}
                        onChange={(e) => {
                            setType(e.target.value);

                        }}
                        className="w-full p-2 border rounded-md bg-white shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    >
                        {
                            TYPE_POSTS.map((type,index) =>(
                                <option key={index} value={type}>{type}</option>
                            ))
                        }

                    </select>
                </div>
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Tiêu đề</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700">Nội dung</label>
                    <textarea
                        id="content"
                        rows="4"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    ></textarea>
                </div>
                <div>
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700">Hình ảnh</label>
                    <div className="photos">
                        {images.map((image, index) => (
                            <div key={index} className="relative mt-10">
                        {/* Wrapper div with relative positioning */}
                        <div className="relative w-full bg-cover bg-center">
                            {/* Cover image */}
                            <img
                                className="w-full h-full object-cover"
                                src={image.imageUrl}
                                alt="cover photo"
                            />
                            {/* Hover effect for the bottom third */}
                            <div
                                onClick={() =>{
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
                                            // Xử lý file ảnh ở đây
                                            // console.log(URL.createObjectURL(file));
                                            Swal.fire({
                                                title: "",
                                                html: `
                    <div class="flex justify-center items-center h-full">
                    <img className="mx-auto my-auto rounded-full border-2 border-pink-600 p-1"
                    src = "${URL.createObjectURL(file)}"
                    alt="profile"
                    />
                    <div/>
                    `,
                                                confirmButtonText: 'Thêm ảnh',
                                                focusConfirm: false,
                                                preConfirm: () => {

                                                    return file;
                                                },
                                            }).then((result) => {
                                                if (result.isConfirmed) {
                                                    const formData = new FormData();
                                                    formData.append('image', result.value);

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

                                                    // Thay thế 'your-backend-endpoint' với endpoint thực tế của bạn
                                                    axiosClient.put(`/post/img/${image.imageId}`, formData, {
                                                        headers: {
                                                            'Content-Type': 'multipart/form-data'
                                                        }
                                                    }).then((res) => {
                                                        setImages([res])

                                                        Swal.close();
                                                        Swal.fire({
                                                            icon: "success",
                                                            title: "thành công",
                                                            text: 'sủa ảnh thành công'
                                                        });

                                                    }).catch((err) => {
                                                        Swal.fire({
                                                            icon: "error",
                                                            title: "Lỗi",
                                                            text: err.message
                                                        });
                                                    });


                                                }
                                            });

                                        } else {
                                            console.log('File không phải là ảnh.');
                                        }
                                    };

                                    // Kích hoạt click event
                                    input.click();
                                }}
                                className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 w-full h-1/3 flex items-center justify-center text-white font-medium text-sm cursor-pointer opacity-0 hover:opacity-100 transition duration-300 ease-in-out">
                                Sửa ảnh
                            </div>
                        </div>
                    </div>
                        ))}
                    </div>
                </div>
                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Cập nhật bài viết
                </button>
            </form>
        </div>
        </>
    );
}