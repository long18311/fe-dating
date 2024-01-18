import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../../styles/slideshow.css'; // Đảm bảo đã import CSS tùy chỉnh
import {useEffect, useState} from "react";
import React from 'react';
import axiosClient from "../../apis/AxiosClient.js";
import {checkToken} from "../../utils/index.js";
import Basic from "../basic/index.jsx";
import Swal from "sweetalert2";


const SlideShow = () => {
    const [profiles, setProfiles] = React.useState([]);
    const [idProfile, setIdProfile] = useState();

    const settings = {
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
    };
    
    
    const sliderRef = React.createRef(); // Tham chiếu đến slider
    useEffect(() => {
        const tokenExists = checkToken();
        if (!tokenExists) {
            Swal.fire({
                title: 'Loading',
                allowOutsideClick: false,
                showConfirmButton: false,
                onBeforeOpen: () => {
                    Swal.showLoading(); // Hiển thị biểu tượng spinner từ Font Awesome
                },
                // Thêm một biểu tượng spinner từ Font Awesome
                html: '<i class="fa fa-spinner fa-spin fa-2x"></i>',
            });
            axiosClient.get("userlogged")
                .then((res) => {
                    axiosClient.get(`/graph/relatedUsers/${res.id}`)
                        .then((response) => {
                            Swal.close()
                            // console.log(response)
                            setProfiles(response)
                        })
                        .catch((error) => {
                            Swal.close();
                            console.error("Error fetching related users:", error);
                            // Thực hiện các hành động xử lý lỗi khác nếu cần
                        });
                })
                .catch((err) => {
                    Swal.close();
                    console.error("Error fetching user logged:", err);
                    // Thực hiện các hành động xử lý lỗi khác nếu cần
                });

        } else {
            window.location.href = 'http://localhost:5173/loginpage';
        }
    }, []);


    const handleNextSlide = () => {
        sliderRef.current.slickNext(); // Chuyển đến slide kế tiếp
    };

    const handlePrevSlide = () => {
        sliderRef.current.slickPrev(); // Chuyển đến slide trước đó
    };


    return (
        <div className="custom-container">
            <div className="min-h-screen mt-20">
                <Slider {...settings} ref={sliderRef}>
                    {profiles.map((profile, index) => (
                        <Basic profile={profile} onNext={handleNextSlide} onPrev={handlePrevSlide} />
                    ))}
                </Slider>
            </div>
        </div>
    );
};

export default SlideShow;