import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../../styles/slideshow.css'; // Đảm bảo đã import CSS tùy chỉnh
import {useEffect} from "react";
import React from 'react';
import axiosClient from "../../apis/AxiosClient.js";
import {checkToken} from "../../utils/index.js";
import {useNavigate} from "react-router-dom";
import Example from "../Examp/Example.jsx";
import Basic from "../basic/index.jsx";

const SlideShow = () => {
    const  navigate = useNavigate();
    const [profiles, setProfiles] = React.useState([]);




    // const profile = [
    //     {
    //         name:"Nguyễn Công Thiện",
    //         img:"https://i.pinimg.com/736x/68/7f/f5/687ff58b82cf34da0cd1369598f22104.jpg"
    //     },
    //     {
    //         name:"Nguyễn Văn A",
    //         img:"https://bookvexe.vn/wp-content/uploads/2023/04/suu-tam-25-hinh-anh-avatar-gai-xinh-cuc-hot_1.jpg"
    //     },
    //     {
    //         name:"Nguyễn Công Thiện",
    //         img: "https://benhvienthammydonga.vn/wp-content/uploads/2022/06/gai-xinh-voi-duong-net-guong-mat-thu-hut.jpg"
    //     },
    //     {
    //         name:"Nguyễn Văn A",
    //         img:"https://gaixinhbikini.com/wp-content/uploads/2022/08/855b87a20f6cf7e150265e63aabde455.jpg"
    //     },
    //     {
    //         name:"Nguyễn Văn A",
    //         img:"https://gaixinhbikini.com/wp-content/uploads/2022/08/855b87a20f6cf7e150265e63aabde455.jpg"
    //     }
    // ]
    const settings = {
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
    };
    
    
    const sliderRef = React.createRef(); // Tham chiếu đến slider
    useEffect(() => {
        if (checkToken()){
            window.location.href = 'http://localhost:5173/loginpage';
        } else{
            axiosClient.get("/search/propose").then((reponse)=>{
                setProfiles(reponse);
            }).catch((error) =>{
                console.log(error)
            })
        }

    }, []);

    const handleNextSlide = () => {
        sliderRef.current.slickNext(); // Chuyển đến slide kế tiếp
    };

    // Tự động chuyển slide sau mỗi khoảng thời gian (ví dụ: 2 giây)
    React.useEffect(() => {
        const interval = setInterval(() => {
            handleNextSlide();
        }, 200000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
        <div className="custom-container">
            <div className="min-h-screen mt-20">
                <Slider {...settings} ref={sliderRef}>
                    {profiles.map((profile, index) => (

                        // <div key={index} className={"hover:bg-gray-300"} onClick={()=>{alert(index)}}>
                        //     <div className="custom-slide">
                        //         <div className="square-image">
                        //             <img
                        //                 src={profile.img}
                        //                 className="w-full h-full object-cover ml-10 mt-5 rounded-3xl  border-white border-2 "
                        //             />
                        //         </div>
                        //     </div>
                        //     <div className={"mt-2"}>
                        //         <div className={"mt-3 ml-5 text-blue-900 "}>{profile.name}</div>
                        //         <i className="fas fa-map-marker-alt mt-1 ml-1  "></i>
                        //         <span className={"mt-1 ml-1 text-black "}>Hà Nội</span>
                        //         <span className={"mt-1 ml-1"}>18 tuổi</span>
                        //         <i className="fas fa-heart ml-1 "></i>
                        //         <span className={"mt-1 ml-1 text-blue-900"}>Độc thân</span></div>
                        // </div>
                        // <Example  nextSlide = {handleNextSlide} />
                        <Basic profile = {profile}/>
                    ))}

                </Slider>
            </div>
        </div>
    );
};

export default SlideShow;