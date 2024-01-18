import {NavLink, useNavigate, useParams} from 'react-router-dom';
import axiosClient from "../../apis/AxiosClient.js";
import React, {useEffect, useState} from "react";
import HeaderDefaultLayout from "../../components/defaultlayout/HeaderDefaultLayout.jsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faCoffee, faMusic, faBriefcase, faUser } from '@fortawesome/free-solid-svg-icons';
import FooterDefaultLayout from "../../components/defaultlayout/FooterDefaultLayout.jsx";
import showErrorAlert from "../SwalAlert/showErrorAlert.jsx";
import Swal from "sweetalert2";
import AxiosClient from "../../apis/AxiosClient.js";
import showConfirmDelete from "../SwalAlert/showConfirmDelete.jsx";
import showSuccessAlert from "../SwalAlert/showSuccessAlert.jsx";
import {checkToken} from "../../utils/index.js";
import LogoVerify from "../../assets/images/verify.png"

const ProfileUsersDetail = () => {
    const {userId} = useParams();
    const [userDetail, setUserDetail] = useState({})
    const [userLogged, setUserLogged] = useState({})
    const [informationOptions, setInformationOptions] = useState([])
    const [images, setImages] = useState([])
    const [avt, setAvt] = useState()
    const [join, setJoin] = useState("")
    const [age, setAge] = useState(null);
    const navigate = useNavigate()
    const [status, setStatus] = useState()
    const [showOptions, setShowOptions] = useState(false);
    const [user, setUser] = useState({})
    const [security, setSecurity] = useState(true);
    const [open, setOpen] = useState(false);
    const [subMenuOpen, setSubMenuOpen] = useState(false);
    const [checkAuthorities, setCheckAuthorities] = useState(null);
    const [zoomedImageIndex, setZoomedImageIndex] = useState(null);
    const toggleImageZoom = (index) => {
        if (zoomedImageIndex === index) {
            // Nếu hình ảnh hiện tại đã được phóng to, thu nhỏ nó lại
            setZoomedImageIndex(null);
        } else {
            // Nếu không, phóng to hình ảnh được chọn
            setZoomedImageIndex(index);
        }
    };

    function containsAdminRole(authorities) {
        return authorities.some(auth => auth.name === "ROLE_ADMIN");
    }


    useEffect(()=>{
        if (checkToken()){
        navigate("/loginpage")}},[])

    // gọi api
    useEffect(() => {
        const fetchData = async () => {
            try {
                const userLoggedResponse = await axiosClient.get("/userProfile");
                const profileResponse = await axiosClient.get("/userProfile/profile/" + userId);
                // Lấy trạng thái từ cơ sở dữ liệu
                const statusResponse = await axiosClient.get(`/status`,{params:{
                        senderId: userLoggedResponse.id,
                        receiverId: profileResponse.id,
                    }});

                setCheckAuthorities(containsAdminRole(profileResponse.authorities))

                // setSecurity(profileResponse.security)
                if (statusResponse === "accepted") {
                    setStatus("accepted");
                } else if (statusResponse === "pending") {

                    setStatus("pending");
                } else if (statusResponse === "rejected") {

                    setStatus("rejected");
                }

                console.log(userLoggedResponse,profileResponse)

                // Kiểm tra nếu cả hai kết quả giống nhau
                if (userLoggedResponse.id === profileResponse.id) {
                    navigate("/profilepage");
                }

              if (profileResponse.actived===0){
                  navigate("/page-not-found")
                  return;
              }


                setUserDetail(profileResponse);
                setUserLogged(userLoggedResponse);
                setInformationOptions(profileResponse.informationOptions);
                setImages(profileResponse.images);
                setAvt(`${profileResponse.avatar}`);
                const previousTime = new Date(profileResponse.created_date);
                const currentTime = new Date();
                const timeDifference = currentTime - previousTime;
                const days = Math.floor(timeDifference / (24 * 60 * 60 * 1000));
                if (days === 0) {
                    setJoin("Tham gia LoveLink hôm nay");
                }
                if (days > 0) {
                    setJoin("Tham gia LoveLink " + days + " ngày trước");
                }
            } catch (error) {
               navigate("/page-not-found")
            }
        };
        fetchData();
    }, [userId]);
    // button xử lí
    const toggleFriendStatus = () => {
        if (status === "pending") {
            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    AxiosClient.delete("/friend/reject", {
                        params: {
                            senderUserId: userLogged.id,
                            receiverUserId: userDetail.id
                        }
                    })
                        .then().catch()

                    AxiosClient.delete("/friend/reject", {
                        params: {
                            receiverUserId: userLogged.id,
                            senderUserId: userDetail.id
                        }
                    })
                        .then(
                            () => {
                                Swal.fire(
                                    'Deleted!',
                                    'Your file has been deleted.',
                                    'success'
                                )
                                setStatus("reject")
                            }
                        ).catch()
                }
            })

        } else {
            axiosClient.post("/friend/addfriend/"+userDetail.id).then(
                (res) => {
                    showErrorAlert("success", "", "Đã gửi lời mời")
                    setStatus("pending")
                }
            ).catch(
                (err) => {
                    console.log(err)
                }
            )

        }

    };

    useEffect(() => {
        if (userDetail.birthday) {
            const birthDateTime = new Date(userDetail.birthday).getTime();
            const currentTime = Date.now();
            const ageInMilliseconds = currentTime - birthDateTime;
            // Số mili giây trong một năm (xấp xỉ)
            const millisecondsPerYear = 365.25 * 24 * 60 * 60 * 1000;
            const calculatedAge = Math.floor(ageInMilliseconds / millisecondsPerYear);
            setAge(calculatedAge);
        }
    }, [userDetail.birthday]);

    function maskEmail(email) {
        const [username, domain] = email.split('@');
        const maskedUsername = username.substring(0, 3) + '*'.repeat(username.length - 3);
        const domainParts = domain.split('.');
        const maskedDomain = domainParts.map((part, index) => {
            if (index === 0) {
                return '*'.repeat(part.length);
            } else if (index === domainParts.length - 1) {
                return part[0] + '*'.repeat(part.length - 2) + part[part.length - 1];
            }
            return part;
        }).join('.');

        return maskedUsername + '@' + maskedDomain;
    }


    return (
        <>
            <HeaderDefaultLayout/>
            <main className="bg-gray-100 bg-opacity-25">
                <div className="lg:w-8/12 lg:mx-auto mb-8">
                    <div className="relative mt-10">
                        <img
                            className="w-full h-[250px]  bg-cover bg-center"
                            src={userDetail.cover}
                        />

                    </div>

                    <header className="flex flex-wrap items-center p-4 md:py-8">
                        <div className="md:w-3/12 md:ml-16">
                            <img
                                className="w-20 h-20 md:w-40 md:h-40 object-cover rounded-full border-2 border-pink-600 p-1"
                                src={userDetail.avatar}
                                alt="profile"
                            />
                        </div>
                        <div className="w-8/12 md:w-7/12 ml-4">
                            <div className="md:flex md:flex-wrap md:items-center mb-4">
                                <h2 className="text-3xl inline-block font-light md:mr-2 mb-2 sm:mb-0">
                                    {`${userDetail.lastname} ${userDetail.firstname} ${userDetail.lastname ? `(${userDetail.nickname})` : ''}`
                                    }

                                </h2>
                                {checkAuthorities && <img className={"w-5 h-5"} src={LogoVerify} alt="" />}

                                <NavLink to=""
                                         className={`ml-3 px-4 py-2 text-white font-semibold text-sm rounded block text-center sm:inline-block block`}
                                         style={{backgroundColor: status === 'pending' ? '#7da5ee' : (status === 'accepted' ? '#87a8f1' : '#2563EB')}}>
                                    <i className={status === 'pending' ? "fas fa-user-minus" : (status === 'accepted' ? "fas fa-user-friends" : "fas fa-user-plus")}/>
                                    <button className="ml-2" onClick={toggleFriendStatus} disabled={status === 'accepted'}>
                                        {status === 'pending' ? 'Hủy kết bạn' : (status === 'accepted' ? 'Bạn bè' : 'Thêm bạn bè')}
                                    </button>
                                </NavLink>



                                {status === 'accepted' &&

                                    <NavLink
                                        onClick={() => {
                                            showConfirmDelete("Hủy kết bạn", "Bạn chắc chắn chưa", "Tôi chắc")
                                                .then(() => {
                                                    return axiosClient.delete("/friend/unfriend", {
                                                        params: {
                                                            user1Id: userLogged.id,
                                                            user2Id: userDetail.id
                                                        }
                                                    });
                                                })
                                                .then(() => {
                                                    showSuccessAlert('Thành công');
                                                    setStatus("rejected")
                                                })
                                                .catch((error) => {
                                                    // Xử lý lỗi nếu có
                                                });
                                        }}
                                        className=" bg-red-400  ml-2 px-4 py-2 text-white font-semibold text-sm rounded block text-center sm:inline-block block"
                                        to="">
                                        <i className={"fas fa-user-minus"}></i>
                                        <button className={"ml-2"}>Hủy kết bạn</button>
                                    </NavLink>
                                }

                                {status === 'accepted' &&

                                    <NavLink
                                        className="  bg-blue-600  ml-2 px-4 py-2 text-white font-semibold text-sm rounded block text-center sm:inline-block block"
                                        to={`/message/${userId}`}
                                        >
                                        <i className={"fas fa-comment"}></i>

                                        <button className={"ml-2"} onClick={()=> {console.log(`/message/${userId}`)}}>Nhắn tin</button>
                                    </NavLink>
                                }

                                <div className={"ml-3 mt-1 "} >
                                    <div className="relative inline-block text-left ">
                                        <button onClick={() => setOpen(!open)} className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-white     bg-blue-600 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-gray-100 focus:ring-blue-500">
                                            ...
                                        </button>

                                        {open && (
                                            <div className="origin-top-left absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 px-2 py-2">

                                                <div className="relative items-center">
                                                    <button
                                                        onClick={() => setSubMenuOpen(!subMenuOpen)}
                                                        className={`flex justify-between items-center w-55 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 relative rounded-md ${subMenuOpen ? 'bg-gray-200' : ''}`}
                                                    >
                                                        Report
                                                    </button>


                                                    {subMenuOpen && (
                                                        <div className="absolute top-10  w-55 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 ">
                                                            <NavLink to= {`/report/${userId}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">Lạm dụng</NavLink>
                                                            <NavLink to= {`/report-fake/${userId}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">Giả mạo</NavLink>
                                                        </div>
                                                    )}
                                                </div>


                                            </div>
                                        )}
                                    </div>
                                </div>

                            </div>
                            <ul className="hidden md:flex space-x-8 mb-4">
                            <li>
                                    <span className="font-semibold">Số ảnh :</span>
                                    {" " + images.length}
                                </li>
                                <li>
                                    <span className="font-semibold">{}</span> Friends
                                </li>
                                <li>
                                    <span className="font-semibold">Giới tính: </span>
                                     {" " + userDetail .sex}
                                </li>
                            </ul>
                        </div>
                        <div className="md:flex md:space-x-4">
                            <div className="md:w-1/3 mt-5">
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
                                                                className="  ml-2 px-4 py-2 rounded-full border border-pink-400 font-semibold text-sm shadow transition duration-300 ease-in-out transform hover:scale-110 hover:shadow-lg"
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
                            {security ? (<div  className="md:w-1/3 rounded-3xl mt-5  " style={{
                                borderLeft: '2px solid #e5e7eb', // gray-300
                                borderBottom: '2px solid #e5e7eb', // gray-300
                            }} >
                                {/* Cột thứ hai */}
                                <div className="mt-4 ml-10 ">
                                    <i className="fas fa-heart "></i>
                                    <span className="ml-2 text-blue-950">Mối quan hệ :</span>
                                    <div className="">{userDetail.maritalstatus}</div>
                                </div>
                                <div className="mt-4 ml-10 ">
                                    <i className="fas fa-book  "></i>
                                    <span className="ml-2 text-blue-950">Giới thiệu :</span>
                                    <div className="">{userDetail.about}</div>
                                </div>
                                <div className="mt-4 ml-10">
                                    <i className="fas fa-book  "></i>
                                    <span className="ml-2 text-blue-950">Địa chỉ :</span>
                                    <div className="">{"Địa chỉ ở đây"}</div>
                                </div>
                                <div className="mt-4 ml-10">
                                    <i className="fas fa-map-marker-alt"></i>
                                    <span className="ml-2 text-blue-950">Quê quán :</span>
                                    <div className="">{userDetail.ward + ", " + userDetail.district + ", " + userDetail.city}</div>
                                </div>
                                <div className="mt-4 ml-10 ">
                                    <i className="fas fa-book  "></i>
                                    <span className="ml-2 text-blue-950">chiều cao :</span>
                                    <div className="">{userDetail.height} cm</div>
                                </div>
                                <div className="mt-4 ml-10 ">
                                    <i className="fas fa-book  "></i>
                                    <span className="ml-2 text-blue-950">cân nặng :</span>
                                    <div className="">{userDetail.weight} kg</div>
                                </div>
                                <div className="mt-4 ml-10">
                                    <i className="fas fa-envelope"></i>
                                    <span className="ml-2 text-blue-950">Email :</span>
                                    {userDetail.email && <div className="">{maskEmail(userDetail.email)}</div> }

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

                            <div className="md:w-1/3 rounded-3xl mt-5"   style={{
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
            <FooterDefaultLayout/>
        </>
    );
};

export default ProfileUsersDetail;
