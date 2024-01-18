import HeaderDefaultLayout from "../../components/defaultlayout/HeaderDefaultLayout.jsx";
import FooterDefaultLayout from "../../components/defaultlayout/FooterDefaultLayout.jsx";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { checkToken } from "../../utils/index.js";
import axiosClient from "../../apis/AxiosClient.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee, faMusic, faBriefcase, faUser } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';
import ShowInfoAlert from "../SwalAlert/showInfoAlert.jsx";
import LogoVerify from "../../assets/images/verify.png"


export default function ProfileUserNew() {


    const [user, setUser] = useState({})
    const [informationOptions, setInformationOptions] = useState([])
    const [images, setImages] = useState([])
    // const [checkFirstLogin, setCheckFirstLogin] = useState(true)
    const [avt, setAvt] = useState()
    const [join, setJoin] = useState("")
    const [age, setAge] = useState();
    const [security, setSecurity] = useState(true);
    const [zoomedImageIndex, setZoomedImageIndex] = useState(null);
    const [checkAuthorities, setCheckAuthorities] = useState(null);


    const toggleImageZoom = (index) => {
        if (zoomedImageIndex === index) {
            // Nếu hình ảnh hiện tại đã được phóng to, thu nhỏ nó lại
            setZoomedImageIndex(null);
        } else {
            // Nếu không, phóng to hình ảnh được chọn
            setZoomedImageIndex(index);
        }
    };

    const navigate = useNavigate()
    // const tags = ["Phong cách sống", "Chiều cao", "Thông tin cơ bản"];
    function containsAdminRole(authorities) {
        return authorities.some(auth => auth.name === "ROLE_ADMIN");
    }

    useEffect(() => {
        if (checkToken()) {
            navigate("/loginpage")
        } else {
            axiosClient.get("/userProfile").then((res) => {
                setInformationOptions(res.informationOptions);
                setUser(res)
                setImages(res.images)
                setAvt(`${res.avatar}`)
                setCheckAuthorities(containsAdminRole(res.authorities))
                // Thời gian trước đó có định dạng '2023-10-02T12:02:11.000+00:00'
                const previousTime = new Date(res.created_date);
                const currentTime = new Date();

                // Tính số miligiây chênh lệch giữa hai thời gian
                const timeDifference = currentTime - previousTime;

                // Tính số ngày bằng cách chia số miligiây cho (số miligiây trong một ngày)
                const days = Math.floor(timeDifference / (24 * 60 * 60 * 1000));

                if (days === 0) {
                    setJoin("Tham gia LoveLink hôm nay")
                }
                if (days > 0) {
                    setJoin("Tham gia LoveLink " + days + " ngày trước")
                }


                if (res.informationOptions.length < 1) {
                    ShowInfoAlert("Xin chào bạn", "Cảm ơn bạn đã đăng nhập , lần đầu tiên hãy khởi tạo thông tin cá nhân trước nhé")
                    navigate("/createpage")
                }



            })
        }
    }, []);


    useEffect(() => {
        const birthDateTime = new Date(user.birthday).getTime();
        const currentTime = Date.now();
        const ageInMilliseconds = currentTime - birthDateTime;

        // Số mili giây trong một năm (xấp xỉ)
        const millisecondsPerYear = 365.25 * 24 * 60 * 60 * 1000;
        const calculatedAge = Math.floor(ageInMilliseconds / millisecondsPerYear);
        setAge(calculatedAge);
    }, [user.birthday]);

    function isAdmin(user) {
        return user.authorities.includes('ROLE_ADMIN');
    }

    return (
        <>
            <HeaderDefaultLayout />
            <main className="bg-gray-100 bg-opacity-25">
                <div className="lg:w-8/12 lg:mx-auto mb-8">
                    <div className="relative mt-10">
                        <img
                            className="w-full h-[250px]  bg-cover bg-center"
                            src={user.cover}
                        />
                    </div>
                    <header className="flex flex-wrap items-center p-4 md:py-8">
                        <div className="md:w-3/12 md:ml-16">
                            <img
                                className="w-20 h-20 md:w-40 md:h-40 object-cover rounded-full border-2 border-pink-600 p-1"
                                src={user.avatar}
                                alt="profile"
                            />
                        </div>
                        <div className="w-8/12 md:w-7/12 ml-4">
                            <div className="md:flex md:flex-wrap md:items-center mb-4">
                                <h2 className="text-3xl inline-block font-light md:mr-2 mb-2 sm:mb-0">
                                    {`${user.lastname} ${user.firstname} ${user.nickname ? `(${user.nickname})` : ''}`
                                    }
                                </h2>

                                {checkAuthorities && <img className={"w-5 h-5"} src={LogoVerify} alt="" />}
                                <NavLink className=" bg-orange-500  ml-3 px-4 py-2 text-white font-semibold text-sm rounded block text-center sm:inline-block block" to="/updatepage">
                                    <button>Chỉnh sửa hồ sơ</button>
                                    <i className={"fas fa-edit ml-3"}></i>
                                </NavLink>
                            </div>
                            <ul className="hidden md:flex space-x-8 mb-4">
                                <li>
                                    <span className="font-semibold">Số ảnh :</span>
                                    {" " + images.length}
                                </li>
                                <li>
                                    <span className="font-semibold">
                                        {user.numberFriend + " "}
                                    </span> Friends
                                </li>
                                <li>
                                    <span className="font-semibold">Giới tính: </span>
                                    {" " + user.sex}
                                </li>
                            </ul>
                        </div>

                        <div className="md:flex md:space-x-4">
                            <div className="md:w-1/3">
                                <div className="mt-4 flex flex-wrap -mx-2">
                                    {[
                                        { name: 'hobby', content: 'Sở thích', icon: faCoffee }, // Thay thế faCoffee bằng icon tương ứng
                                        { name: 'passion', content: 'Phong cách sống', icon: faMusic }, // Ví dụ
                                        { name: 'profession', content: 'Nghề nghiệp', icon: faBriefcase }, // Ví dụ
                                        { name: 'basic_information', content: 'Thông tin cơ bản', icon: faUser } // Ví dụ
                                    ].map((category) => (
                                        <div key={category.name} className="w-full px-2 mb-4">
                                            <fieldset className="border p-4 rounded-lg shadow-xl">
                                                <legend className="text-lg font-semibold leading-6 text-gray-900 flex items-center space-x-2">
                                                    <FontAwesomeIcon
                                                        icon={category.icon}
                                                        size="lg"
                                                        className="text-green-500"
                                                        style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}
                                                    />
                                                    <span>{category.content}</span>
                                                </legend>
                                                <div className="mt-6 flex flex-wrap gap-2">
                                                    {informationOptions
                                                        .filter((option) => option.informationField.informationType === category.name)
                                                        .map((filteredOption) => (
                                                            <span
                                                                className="ml-2 px-4 py-2 rounded-full border border-pink-400 font-semibold text-sm shadow transition duration-300 ease-in-out transform hover:scale-110 hover:shadow-lg"
                                                                key={filteredOption.id}
                                                            >
                                                            {filteredOption.option}
                                                                    </span>
                                                        ))
                                                    }
                                                </div>

                                            </fieldset>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {security ? (<div className="md:w-1/3" style={{
                                borderLeft: '2px solid #e5e7eb', // gray-300
                                borderBottom: '2px solid #e5e7eb', // gray-300
                            }}>
                                {/* Cột thứ hai */}
                                <div className="mt-4 ml-10">
                                    <i className="fas fa-heart "></i>
                                    <span className="ml-2 text-blue-950">Mối quan hệ :</span>
                                    <div className="">{user.maritalstatus}</div>
                                </div>
                                <div className="mt-4 ml-10">
                                    <i className="fas fa-book  "></i>
                                    <span className="ml-2 text-blue-950">Giới thiệu :</span>
                                    <div className="">{user.about}</div>
                                </div>
                                <div className="mt-4 ml-10">
                                    <i className="fas fa-book  "></i>
                                    <span className="ml-2 text-blue-950">Địa chỉ :</span>
                                    <div className="">{"Địa chỉ ở đây"}</div>
                                </div>

                                <div className="mt-4 ml-10">
                                    <i className="fas fa-map-marker-alt"></i>
                                    <span className="ml-2 text-blue-950">Quê quán :</span>
                                    <div className="">{user.ward + ", " + user.district + ", " + user.city}</div>
                                </div>
                                <div className="mt-4 ml-10 ">
                                    <i className="fas fa-book  "></i>
                                    <span className="ml-2 text-blue-950">chiều cao :</span>
                                    <div className="">{user.height} cm</div>
                                </div>
                                <div className="mt-4 ml-10 ">
                                    <i className="fas fa-book  "></i>
                                    <span className="ml-2 text-blue-950">cân nặng :</span>
                                    <div className="">{user.weight} kg</div>
                                </div>
                                <div className="mt-4 ml-10">
                                    <i className="fas fa-envelope"></i>
                                    <span className="ml-2 text-blue-950">Email :</span>
                                    <div className="">{user.email}</div>
                                </div>
                                <div className="mt-4 ml-10">
                                    <i className="fas fa-birthday-cake"></i>
                                    <span className="ml-2 text-blue-950">Tuổi :</span>
                                    <span className="">{age + ""}</span>
                                </div>
                                <div className="mt-4 ml-10">
                                    <i className="fas fa-flag"></i>
                                    <span className="ml-2 text-blue-950">Tham gia :</span>
                                    <div className="">{join}</div>
                                </div>
                            </div>) :(< div className="md:w-2/3 ">

                                <img className={"w-full h-auto"} src="https://automonkey.co/wp-content/uploads/2021/03/Followers-on-Instagram-Private-Account.png" />

                            </div>) }
                            <div className="md:w-1/3 rounded-3xl"  style={{
                                borderLeft: '2px solid #e5e7eb', // gray-300
                                borderBottom: '2px solid #e5e7eb', // gray-300
                            }} >
                                <ul className="flex items-center justify-around md:justify-center space-x-12 uppercase tracking-widest font-semibold text-xs text-gray-600 border-t">

                                    <li className="md:border-t md:border-gray-700 md:-mt-px md:text-gray-700">
                                        <a className="inline-block p-3" href="#">
                                            <i className="far fa-square text-xl md:text-xs"></i>
                                            <span className="hidden md:inline">Ảnh nổi bật</span>
                                        </a>
                                    </li>

                                </ul>
                                <div className="flex flex-wrap -mx-px md:-mx-3 overflow-y-scroll h-[500px]">
                                    {images.map((o, i) => (
                                        <div className="w-1/2 p-px md:px-3" key={i}>
                                            <div>
                                                <article className="ml-6 mt-2 post bg-gray-100 text-white relative pb-full md:mb-6">
                                                    <img onClick={() => toggleImageZoom(i)}
                                                         className="w-full h-full rounded-lg absolute left-0 top-0 object-cover"
                                                         src={o.url}
                                                         alt="image"
                                                    />
                                                </article>
                                            </div>
                                            {zoomedImageIndex === i && (
                                                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={() => toggleImageZoom(i)}>
                                                    <img src={o.url}  className="w-96 h-96 p-4 object-contain" />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            </div>
                    </header>

                </div>
            </main>
            <FooterDefaultLayout />
        </>
    );
}

