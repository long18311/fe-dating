import HeaderDefaultLayout from "../../components/defaultlayout/HeaderDefaultLayout.jsx";
import FooterDefaultLayout from "../../components/defaultlayout/FooterDefaultLayout.jsx";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { checkToken } from "../../utils/index.js";
import axiosClient from "../../apis/AxiosClient.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee, faBook, faBriefcase, faUser } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';
import ShowInfoAlert from "../SwalAlert/showInfoAlert.jsx";


export default function ProfileUserNew() {


    const [user, setUser] = useState({})
    const [informationOptions, setInformationOptions] = useState([])
    const [images, setImages] = useState([])
    const [checkFirstLogin, setCheckFirstLogin] = useState(true)
    const [avt, setAvt] = useState()
    const [join, setJoin] = useState("")
    const [age, setAge] = useState();
    const navigate = useNavigate()
    // const tags = ["Phong cách sống", "Chiều cao", "Thông tin cơ bản"];


    useEffect(() => {
        if (checkToken()) {
            navigate("/loginpage")
        } else {
            axiosClient.get("/userProfile").then((res) => {
                setInformationOptions(res.informationOptions);
                console.log(res)
                console.log(res.informationOptions)

                setUser(res)
                setImages(res.images)
                setAvt(`${res.avatar}`)
                console.log(res.created_date)
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

                                {/*<NavLink*/}
                                {/*    to={"/"}*/}
                                {/*
                                {/*>*/}
                                {/*    Chỉnh sửa hồ sơ*/}
                                {/*</NavLink>*/}
                               
                                <NavLink className=" bg-orange-500  ml-3 px-4 py-2 text-white font-semibold text-sm rounded block text-center sm:inline-block block" to="/createpage">
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
                                    <span className="font-semibold">{user.numberFriend + " "}</span> Friends
                                </li>
                                <li>
                                    <span className="font-semibold">Giới tính: </span>
                                    {" " + user.sex}
                                </li>
                            </ul>
                        </div>

                        <div className="md:flex md:space-x-4">
                            <div className="md:w-1/3">
                                {/* Cột đầu tiên */}
                                <div className="mt-4 flex flex-wrap -mx-2">
                                    {
                                        [
                                            { name: 'hobby', content: 'Sở thích', icon: faCoffee }, // Thay thế faCoffee bằng icon tương ứng
                                            { name: 'passion', content: 'Phong cách sống', icon: faBook }, // Ví dụ
                                            { name: 'profession', content: 'Nghề nghiệp', icon: faBriefcase }, // Ví dụ
                                            { name: 'basic_information', content: 'Thông tin cơ bản', icon: faUser } // Ví dụ
                                        ].map((category) => (
                                            <div className="w-1/2 px-2" key={category.name}>
                                                <fieldset>
                                                    <legend className="text-lg font-semibold leading-6 text-gray-900">
                                                        <FontAwesomeIcon
                                                            icon={category.icon}
                                                            size="lg"
                                                            color="green"
                                                            style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)' }}
                                                        />
                                                        {category.content}
                                                    </legend>
                                                    <div className="mt-6 space-y-6">
                                                        {informationOptions
                                                            .filter((option) => option.informationField.informationType === category.name)
                                                            .map((filteredOption) => (
                                                                <span
                                                                    className={"bg-red-200 ml-2 px-4 py-2 rounded-full border-2 font-semibold text-sm sm:inline-block block"}
                                                                    key={filteredOption.id}
                                                                >
                                                                    {filteredOption.option + ' '}
                                                                </span>
                                                            ))
                                                        }
                                                    </div>
                                                </fieldset>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>

                            <div className="md:w-1/3">
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
                            </div>

                            <div className="md:w-1/3">
                                {/* Cột thứ ba */}
                                <div className="mt-4 ml-10">
                                    <i className="fas fa-envelope"></i>
                                    <span className="ml-2 text-blue-950">Email :</span>
                                    <div className="">{user.email}</div>
                                </div>
                                <div className="mt-4 ml-10">
                                    <i className="fas fa-envelope"></i>
                                    <span className="ml-2 text-blue-950">Quan điểm sống :</span>
                                    <div className="">{"Không thích ràng buộc"}</div>
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
                            </div>
                        </div>



                        <div className="md:hidden text-sm my-2">
                            <h1 className="font-semibold">Sở thích</h1>
                            <span className="bioclassName">Sở thích ở đây</span>
                            <span><strong>Địa chỉ:</strong></span>
                            <span>Địa chỉ</span>
                        </div>
                    </header>
                    <div className="px-px md:px-3">
                        <ul className="flex md:hidden justify-around space-x-8 border-t text-center p-2 text-gray-600 leading-snug text-sm">
                            <li>
                                Ảnh nổi bật :
                                <span className="font-semibold text-gray-800 block">{images.length}</span>

                            </li>
                            <li>
                                <span className="font-semibold text-gray-800 block">{user.numberFriend}</span>
                                Friends
                            </li>
                            <li>
                                <span className="font-semibold text-gray-800 block">Giới tính:</span>
                                {user.sex}
                            </li>
                        </ul>
                        <br />
                        <br />
                        <ul className="flex items-center justify-around md:justify-center space-x-12 uppercase tracking-widest font-semibold text-xs text-gray-600 border-t">
                            <li>
                                <a className="inline-block p-3" href="#">
                                    <i className="fas fa-th-large text-xl md:text-xs"></i>
                                    <span className="hidden md:inline">post</span>
                                </a>
                            </li>
                            <li className="md:border-t md:border-gray-700 md:-mt-px md:text-gray-700">
                                <a className="inline-block p-3" href="#">
                                    <i className="far fa-square text-xl md:text-xs"></i>
                                    <span className="hidden md:inline">Ảnh nổi bật</span>
                                </a>
                            </li>
                            <li>
                                <a className="inline-block p-3" href="#">
                                    <i className="fas fa-user border border-gray-500 px-1 pt-1 rounded text-xl md:text-xs"></i>
                                    <span className="hidden md:inline">tagged</span>
                                </a>
                            </li>
                        </ul>
                        <div className="flex flex-wrap -mx-px md:-mx-3">

                            {images.map((o, i) => (

                                <div className="w-1/3 p-px md:px-3" key={i}>

                                    <a href="#">
                                        <article className="post bg-gray-100 text-white relative pb-full md:mb-6">
                                            <img
                                                className="w-full h-full absolute left-0 top-0 object-cover"
                                                src={o.url}
                                                alt="image"
                                            />
                                            <i className="fas fa-square absolute right-0 top-0 m-1"></i>
                                            <div className="overlay bg-gray-800 bg-opacity-25 w-full h-full absolute left-0 top-0 hidden">
                                                <div className="flex justify-center items-center space-x-4 h-full">
                                                    <span className="p-2">
                                                        <i className="fas fa-heart"></i>
                                                        412K
                                                    </span>
                                                    <span className="p-2">
                                                        <i className="fas fa-comment"></i>
                                                        2,909
                                                    </span>
                                                </div>
                                            </div>
                                        </article>
                                    </a>
                                </div>)
                            )
                            }

                        </div>
                    </div>
                </div>
            </main>
            <FooterDefaultLayout />
        </>
    );
}

