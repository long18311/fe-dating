import {NavLink, useNavigate, useParams} from 'react-router-dom';
import axiosClient from "../../apis/AxiosClient.js";
import {useEffect, useState} from "react";
import HeaderDefaultLayout from "../../components/defaultlayout/HeaderDefaultLayout.jsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCoffee} from "@fortawesome/free-solid-svg-icons";
import FooterDefaultLayout from "../../components/defaultlayout/FooterDefaultLayout.jsx";
import showErrorAlert from "../SwalAlert/showErrorAlert.jsx";
import Swal from "sweetalert2";
import AxiosClient from "../../apis/AxiosClient.js";
import showConfirmDelete from "../SwalAlert/showConfirmDelete.jsx";
import showSuccessAlert from "../SwalAlert/showSuccessAlert.jsx";
import {checkToken} from "../../utils/index.js";

const ProfileUsersDetailNew = () => {
    const {userId} = useParams();
    const [userDetail, setUserDetail] = useState({})
    const [userLogged, setUserLogged] = useState({})
    const [hobbies, setHobbies] = useState([])
    const [images, setImages] = useState([])
    const [avt, setAvt] = useState()
    const [join, setJoin] = useState("")
    const [age, setAge] = useState(null);
    const navigate = useNavigate()
    const [status, setStatus] = useState()
    const [showOptions, setShowOptions] = useState(false);


    useEffect(()=>{
        if (checkToken()){
        navigate("/loginpage")}},[])

    // gọi api
    useEffect(() => {
        const fetchData = async () => {
            try {
                const userLoggedResponse = await axiosClient.get("/userlogged");
                const profileResponse = await axiosClient.get("/profile/" + userId);
                // Lấy trạng thái từ cơ sở dữ liệu
                const statusResponse = await axiosClient.get(`/status`,{params:{
                        senderId: userLoggedResponse.id,
                        receiverId: profileResponse.id,
                    }});

                console.log(statusResponse)

                if (statusResponse === "accepted") {
                    setStatus("accepted");
                } else if (statusResponse === "pending") {

                    setStatus("pending");
                } else if (statusResponse === "rejected") {

                    setStatus("rejected");
                }

                // Kiểm tra nếu cả hai kết quả giống nhau
                if (JSON.stringify(userLoggedResponse) === JSON.stringify(profileResponse)) {
                    navigate("/profilepage");

                }
                setUserDetail(profileResponse);
                setUserLogged(userLoggedResponse);
                setHobbies(profileResponse.hobbies);
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
                console.error(error);
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
                                    {`${userDetail.lastname} ${userDetail.firstname} ${userDetail.lastname ? `(${userDetail.lastname})` : ''}`
                                    }
                                </h2>

                                {/*<NavLink*/}
                                {/*    to={"/"}*/}
                                {/*
                                {/*>*/}
                                {/*    Chỉnh sửa hồ sơ*/}
                                {/*</NavLink>*/}

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
                                        className=" bg-red-400  ml-2 px-4 py-2 text-white font-semibold text-sm rounded block text-center sm:inline-block block"
                                        to="">
                                        <i className={"fas fa-user-minus"}></i>
                                        <button onClick={() => {
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
                                        }} className={"ml-2"}>Hủy kết bạn</button>
                                    </NavLink>
                                }

                                {status === 'accepted' &&

                                    <NavLink
                                        className=" bg-blue-600  ml-2 px-4 py-2 text-white font-semibold text-sm rounded block text-center sm:inline-block block"
                                        to={`/message/${userId}`}
                                        >
                                        <i className={"fas fa-comment"}></i>

                                        <button className={"ml-2"} onClick={()=> {console.log(`/message/${userId}`)}}>Nhắn tin</button>
                                    </NavLink>
                                }



                            </div>
                            <ul className="hidden md:flex space-x-8 mb-4">
                                <li>
                                    <span className="font-semibold">{"số ảnh : ..."}</span>
                                </li>
                                <li>
                                    <span className="font-semibold">50.5k</span> Friends
                                </li>
                                <li>
                                    <span className="font-semibold">Giới tính: </span>
                                    {" " + userDetail.sex}
                                </li>
                            </ul>
                        </div>

                        <div className="md:flex md:space-x-4">
                            <div className="md:w-1/3">
                                {/* Cột đầu tiên */}
                                <div className="mt-4">
                                    <FontAwesomeIcon
                                        icon={faCoffee}
                                        size="lg"
                                        color="green"
                                        style={{textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)'}}
                                    />
                                    <span className="font-semibold ml-2 text-blue-950">Sở thích :</span>
                                    <span className="bioclassName ">
                                    <ul>
                                      {hobbies.map((hobby) => (
                                          <span key={hobby.id_hobbies}>{hobby.name_hobbies + ' ,'}</span>
                                      ))}
                                    </ul>
                                  </span>
                                </div>

                                <div className="mt-4">
                                    <i className="fas fa-heart "></i>
                                    <span className="ml-2 text-blue-950">Mối quan hệ :</span>
                                    <div className="">{userDetail.maritalstatus}</div>
                                </div>
                                <div className="mt-4">
                                    <i className="fas fa-flag"></i>
                                    <span className="ml-2 text-blue-950">Tham gia :</span>
                                    <div className="">{join}</div>
                                </div>
                            </div>

                            <div className="md:w-1/3">
                                {/* Cột thứ hai */}
                                <div className="mt-4 ml-10">
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
                                    <div
                                        className="">{userDetail.ward + ", " + userDetail.district + ", " + userDetail.city}</div>
                                </div>
                            </div>

                            <div className="md:w-1/3">
                                {/* Cột thứ ba */}
                                <div className="mt-4 ml-10">
                                    <i className="fas fa-envelope"></i>
                                    <span className="ml-2 text-blue-950">Email :</span>
                                    <div className="">{userDetail.email}</div>
                                </div>
                                <div className="mt-4 ml-10">
                                    <i className="fas fa-envelope"></i>
                                    <span className="ml-2 text-blue-950">Quan điểm sống :</span>
                                    <div className="">{"Không thích ràng buộc"}</div>
                                </div>
                                <div className="mt-4 ml-10">
                                    <i className="fas fa-birthday-cake"></i>
                                    <span className="ml-2 text-blue-950">Tuổi :</span>
                                    <span className="">{age}</span>
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
                                <span className="font-semibold text-gray-800 block">...</span>

                            </li>
                            <li>
                                <span className="font-semibold text-gray-800 block">50.5k</span>
                                Friends
                            </li>
                            <li>
                                <span className="font-semibold text-gray-800 block">Giới tính:</span>
                                {userDetail.sex}
                            </li>
                        </ul>
                        <br/>
                        <br/>
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
                                            <div
                                                className="overlay bg-gray-800 bg-opacity-25 w-full h-full absolute left-0 top-0 hidden">
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
            <FooterDefaultLayout/>
        </>
    );
};

export default ProfileUsersDetailNew;
