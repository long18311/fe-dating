import HeaderDefaultLayout from "../../components/defaultlayout/HeaderDefaultLayout.jsx";
import FooterDefaultLayout from "../../components/defaultlayout/FooterDefaultLayout.jsx";
import { useForm, Controller } from "react-hook-form";
import AgeSlider from "./AgeSlider.jsx";
import React, {useEffect, useState} from "react";
import GenderSelector from "./GenderSelector.jsx";
import Distance from "./Distance.jsx";
import axiosClient from "../../apis/AxiosClient.js";
import Slider from "react-slick";
import showErrorAlert from "../SwalAlert/showErrorAlert.jsx";
import videoBg3 from "../../assets/videos/videoBg3.mp4";
import {useNavigate} from "react-router-dom";
import logo from  '../../assets/images/welcome/logo-blur.png'
import SearchBar from "../Search/index.jsx";
import SearchUser from "../Slide/Search.jsx";
import Example from "../Examp/Example.jsx";
import {checkToken} from "../../utils/index.js";
import showInfoAlert from "../SwalAlert/showInfoAlert.jsx";


export default function Setting() {
    const navigate = useNavigate();
    const [id,setId] = useState()
    const [gender,setGender] = useState()
    const [age,setAge] = useState()
    const [location,setLocation] = useState()
    const [user,setUser] = useState()
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    useEffect(() => {
        // Kiểm tra xem trình duyệt có hỗ trợ Geolocation không
        if (navigator.geolocation) {
            // Nếu hỗ trợ, gọi getCurrentPosition để lấy vị trí hiện tại của người dùng
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    // Nếu thành công, cập nhật biến latitude và longitude
                    axiosClient.get(`https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}
                    &lon=${position.coords.longitude}&format=json`).then((res)=>{
                    }).catch(()=>{})
                    setLatitude(position.coords.latitude);
                    setLongitude(position.coords.longitude);
                },
                (err) => {
                    showInfoAlert("Thông báo","vui lòng bật vị trí để chúng tôi hỗ trợ bạn tốt hơn")
                    console.log(err)
                }
            );
        }
    }, []);
    const settings = {
        infinite: true,
        speed: 400,
        slidesToShow: 1,
        slidesToScroll: 1,
    };
    const sliderRef = React.createRef(); // Tham chiếu đến slider
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

    const handleAgeChange = (ageValues) => {
        setAge(ageValues)
    };
    const handleDistanceChange = (distance) => {
        setLocation(distance)
    };
    const handleGenderChange = (selectedGender) => {
        setGender(selectedGender)
    };


    useEffect(() => {
        axiosClient.get("/userlogged").then((res) => {
            setId(res.id)

        })
    }, []);
    const [informationFields, setInformationFields] = useState([])
    const [selectedInformationOptions, setSelectedInformationOptions] = useState([]); // Trạng thái lưu các sở thích đã chọn
    const [collapsedSections, setCollapsedSections] = useState({})   
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const toggleCollapse = (sectionId) => {
        setCollapsedSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId]
        }));
    };

    const isCollapsed = (sectionId) => {
        return collapsedSections[sectionId];
    };
    const handleInformationOptionChange = (informationOptionId) => {
        if (selectedInformationOptions.includes(informationOptionId)) {
            // Nếu sở thích đã được chọn, loại bỏ khỏi danh sách
            setSelectedInformationOptions(selectedInformationOptions.filter((id) => id !== informationOptionId));
        } else {
            // Nếu sở thích chưa được chọn, thêm vào danh sách
            setSelectedInformationOptions([...selectedInformationOptions, informationOptionId]);
        }

    };
    useEffect(() => {
        if (checkToken()){
            navigate("/loginpage")
        } else {
            axiosClient.get("userProfile/informationFields").then((res)=>{
                setInformationFields(res)
            })
           
        }
    },[]);
   
    <div className="mt-10 space-y-10">

    
    {/* Trường nhập giới tính */}
    <div>
        <label>Giới tính:</label>
        <Controller
            name="sex"
            control={control}
            defaultValue=""
            rules={{ required: true }}
            render={({ field }) => (
                <div>
                    <label>
                        <input
                            type="radio"
                            {...field}
                            value="Nam"
                        />{" "}
                        Nam
                    </label>
                    <label className={"ml-3"}>
                        <input
                            type="radio"
                            {...field}
                            value="Nữ"
                        />{" "}
                        Nữ
                    </label>
                    <label className={"ml-3"}>
                        <input
                            type="radio"
                            {...field}
                            value="Khác"
                        />{" "}
                        Khác
                    </label>
                </div>
            )}
        />
        {errors.sex && <p>Giới tính là trường bắt buộc.</p>}
    </div>


</div>

    return (
        
        <>
            <HeaderDefaultLayout />
            <div className="flex flex-col lg:flex-row items-center lg:items-start bg-custom-image min-h-screen">

                <div className="w-full lg:w-1/4 px-4 lg:px-0 lg:py-4">

                    <div className={"m-5"}>
                        <i className="fas fa-search "></i>
                        <i className="fas fa-user-friends ml-2"></i>
                        <span className={"ml-2"}>Tìm kiếm nhanh</span>
                        <SearchBar/>
                        <AgeSlider  minAge={18} maxAge={100} onChange={handleAgeChange} />
                        <Distance minDistance={0} maxDistance={200} onChange={handleDistanceChange} />
                        <div className="flex flex-wrap -mx-2">
                        {
                            [
                                { name: 'hobby', content: 'Sở thích' },
                                { name: 'passion', content: 'Phong cách sống' },
                                { name: 'profession', content: 'Nghề nghiệp' },
                                { name: 'basic_information', content: 'Thông tin cơ bản' }
                            ].map((category) => (
                                <div className="w-1/2 px-2" key={category.name}>
                                    <fieldset>

                                        <div className="mt-3 space-y-2">
                                            {informationFields
                                                .filter((infoField) => infoField.informationType === category.name)
                                                .map((infoField) => (
                                                    <div key={infoField.id} className="mb-4">
                                                        <button
                                                            type="button"
                                                            className=" w-full text-left"
                                                            onClick={() => toggleCollapse(infoField.id)}
                                                        >
                                                            <i className="fas fa-caret-down mr-2 text-2xl"></i>
                                                            {infoField.name}
                                                        </button>
                                                        <div className={`${isCollapsed(infoField.id) ? '' : 'hidden'}`}>
                                                            <p className="text-sm text-gray-600 mb-2">{infoField.decsription}</p>
                                                            <div>
                                                                {infoField.informationOptions.map((infoOption) => (
                                                                    <div key={infoOption.id} className="flex items-center mb-2">
                                                                        <input
                                                                            id={`option-${infoOption.id}`}
                                                                            type={infoField.multiSelect ? "checkbox" : "radio"}
                                                                            name={infoField.multiSelect ? `infoField-${infoField.id}` : `infoField-group-${infoField.id}`}
                                                                            value={infoOption.id}
                                                                            onChange={() => handleInformationOptionChange(infoOption.id)}
                                                                            checked={selectedInformationOptions.includes(infoOption.id)}
                                                                            className="mr-2"
                                                                        />
                                                                        <label htmlFor={`option-${infoOption.id}`} className="text-sm leading-6">
                                                                            {infoOption.option}
                                                                        </label>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    </fieldset>
                                </div>
                            ))
                        }
                    </div>
                        <GenderSelector onChange={handleGenderChange} />
                    </div>


                    <button className={"ml-5 mb-2 bg-blue-300 hover:bg-blue-700 text-white py-2 px-4 rounded"} onClick={()=>{


                        let idUserLogged = id;
                        let genderSearch = null;
                        let locationMin = null;
                        let locationMax = null;
                        let ageMin = null;
                        let ageMax = null;

                        if(gender===undefined){
                           genderSearch = "Nam"
                        }else{
                            genderSearch = gender
                        }

                        if(location===undefined){
                            locationMin = 0
                            locationMax = 200
                        }
                        else{
                            locationMin=location[0]
                            locationMax=location[1]
                        }
                        if(age===undefined){
                           ageMin = 18
                            ageMax =100
                        }else{
                            ageMin = age[0]
                            ageMax = age[1]
                        }
                        console.log(selectedInformationOptions)
                        axiosClient.post(`/search/users-by-gender-age-location?id=${idUserLogged}&gender=${genderSearch}
                        &ageMin=${ageMin}&ageMax=${ageMax}&locationMin=${locationMin}&locationMax=${locationMax}&latitude=${latitude}&longitude=${longitude}
                        `,selectedInformationOptions
        
                        ).then((res)=>{
                            if (res.length>0){
                                setUser(res)
                            }else{
                                setUser(res)
                                showErrorAlert("error","Thông báo","Không tìm thấy bạn yêu cầu !")
                            }

                        }).catch((err)=>{
                            console.log(err)})
                    }}>Tìm kiếm</button>

                </div>

                <div className="mx-auto w-full h-auto  object-cover ">
                    {
                        !user && (
                            <div className="flex justify-center items-center min-h-screen">
                                <img className="w-80 h-auto" src={logo} alt="Logo" />
                            </div>
                        )
                    }

                    { user &&
                        <div className="relative min-h-screen ">
                            <div className="sticky top-0 z-50 bg-white">
                                <h1 className="text-center mt-3 mb-3 ">Những người bạn có thể biết</h1>
                                <Slider {...settings} ref={sliderRef} className="custom-slider px-4">
                                    {user.map((profile, index) => (
                  //                       <div key={index} className="bg-gray-300 rounded-3xl border-4 border-white">
                  //                           <div className="flex flex-wrap md:flex-nowrap" onClick={() => navigate("/profile/" + profile.userCheckLocation.id)}>
                  //                               <div className="md:w-1/2 p-4">
                  //                                   <img src={profile.userCheckLocation.avatar} alt="Profile" className="w-full h-48 md:h-auto rounded-3xl object-cover"/>
                  //                               </div>
                  //                               <div className="md:w-1/2 p-4 overflow-hidden">
                  //                                   <h2 className="text-2xl lg:text-4xl font-bold truncate">{profile.userCheckLocation.firstname} {profile.userCheckLocation.lastname}</h2>
                  //                                   <div className="mt-5 font-serif">
                  //                                       <div className="flex items-center mt-3">
                  //                                           <i className="fas fa-heart text-red-500"></i>
                  //                                           <span className="ml-2">Quan hệ:</span>
                  //                                           <span className="ml-2 truncate">{profile.userCheckLocation.maritalstatus}</span>
                  //                                       </div>
                  //                                       <div className="flex items-center mt-3">
                  //                                           <i className="fas fa-landmark"></i>
                  //                                           <span className="ml-2">Quê quán:</span>
                  //                                           <span className="ml-2 truncate">{profile.userCheckLocation.city}</span>
                  //                                       </div>
                  //                                       <div className="flex items-center mt-3">
                  //                                           <i className="fas fa-envelope"></i>
                  //                                           <span className="ml-2">Email:</span>
                  //                                           <span className="ml-2 truncate">{profile.userCheckLocation.email || 'Không có'}</span>
                  //                                       </div>
                  //                                       <div className="flex items-center mt-3">
                  //                                           <i className="fas fa-coffee"></i>
                  //                                           <span className="ml-2">Sở thích:</span>
                  //                                           <span className="ml-2 line-clamp-1">
                  //   {profile.userCheckLocation.hobbies.map((hobby, index) => (
                  //       <span key={index}>{(index ? ', ' : '') + hobby.name_hobbies}</span>
                  //   ))}
                  // </span>
                  //                                       </div>
                  //                                       <div className="flex items-center mt-3">
                  //                                           <i className="fas fa-map"></i>
                  //                                           <span className="ml-2">Cách bạn:</span>
                  //                                           <span className="ml-2 font-bold text-violet-600">{profile.myDistance.toFixed(2)}km</span>
                  //                                       </div>
                  //                                       <div className="mt-4">
                  //                                           <h3 className="text-lg font-semibold">Giới thiệu</h3>
                  //                                           <p className="mt-2 line-clamp-3">{profile.userCheckLocation.about}</p>
                  //                                       </div>
                  //                                   </div>
                  //                               </div>
                  //                           </div>
                  //                       </div>
                                        <Example profile={profile}/>
                                    ))}
                                </Slider>
                            </div>
                        </div>

                    }


                </div>
            </div>
            <FooterDefaultLayout />
        </>

    );
}
