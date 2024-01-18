import HeaderDefaultLayout from "../../components/defaultlayout/HeaderDefaultLayout.jsx";
import FooterDefaultLayout from "../../components/defaultlayout/FooterDefaultLayout.jsx";
import {useEffect, useState} from "react";
import axiosClient from "../../apis/AxiosClient.js";
import {useNavigate} from "react-router-dom";
import showSuccessAlert from "../SwalAlert/showSuccessAlert.jsx";
import AxiosClient from "../../apis/AxiosClient.js";
import Propose from "../Slide/Propose.jsx";
import Search from "../Slide/Search.jsx";
import {checkToken} from "../../utils/index.js";

export  default function Friends (){

    const  [friend,setFriend] = useState()
    const  [statusrequest,setStatusRequest] = useState()
    const  [receiver,setReceiver] = useState()
    const  [userlogged,setUserlogged] = useState()
    const  [isAccepted, setIsAccepted] = useState(false); // Thêm trạng thái để kiểm tra đã chấp nhận hay chưa
    const navigate = useNavigate();



    useEffect(() => {

        if (checkToken()){
            navigate("/loginpage")
        return;
        }

        const featch = async ()=>{
            const  useLogged = await axiosClient.get("/userlogged")
            const  getFriends = await  axiosClient.get(`friend/friends/${useLogged.id}`)
            const  getStatusRequest = await  axiosClient.get(`friend/pendingrequests/${useLogged.id}`)
            const  getReceiver = await  axiosClient.get(`pending/${useLogged.id}`)
            setFriend(getFriends)
            setStatusRequest(getStatusRequest)
            setReceiver(getReceiver)
            setUserlogged(useLogged)
        }

        featch()

    }, []);
    return (
        <>
            <HeaderDefaultLayout/>
            <div className="flex flex-col md:flex-row min-h-screen">

                <div  className="w-full md:w-1/3 p-4 ml-5">

                    <h2 className="text-xl font-bold mb-4">
                        <i className="fas fa-user-plus mr-2"></i>
                        Lời mời</h2>

                    <ul>
                        {statusrequest && statusrequest.map((request) => (
                            <li key={request.id} className="flex items-center flex-wrap bg-gray-200 hover:bg-blue-200 cursor-pointer rounded p-2 mb-4">
                                <div className="flex-shrink-0 mr-2">
                                    <img src={request.avatar} alt="" className="w-10 h-10 rounded-full" />
                                </div>
                                <span onClick={() => { navigate("/profile/" + request.id) }}
                                      className="flex-grow px-2 py-1 truncate w-[calc(100%-4rem)] whitespace-nowrap overflow-hidden">{request.firstname + " " + request.lastname}
                                 </span>
                                <div className="flex space-x-2">
                                    <button onClick={() => {
                                        console.log(request.id)
                                        axiosClient.post("/friend/acceptfriend/"+request.id).then(
                                            () => {
                                                showSuccessAlert("Thành công")
                                                setIsAccepted(true);
                                                const updatedFriends = friend.concat(request);
                                                const updatedStatusRequest = statusrequest.filter((item) => item.id !== request.id);
                                                setFriend(updatedFriends);
                                                setStatusRequest(updatedStatusRequest);
                                            }
                                        )
                                    }} className=" mt-1 bg-blue-600 px-2 py-1 text-xs md:text-sm text-white rounded flex-shrink-0">Chấp nhận</button>
                                    <button onClick={() => {
                                        AxiosClient.delete("/friend/reject", {
                                            params: {
                                                senderUserId: request.id,
                                                receiverUserId: userlogged.id
                                            }
                                        })
                                            .then(() => {
                                                showSuccessAlert('Từ chối thành công');
                                                const updatedStatusRequest = statusrequest.filter((item) => item.id !== request.id);
                                                setStatusRequest(updatedStatusRequest);
                                            }).catch()
                                    }} className="mt-1 bg-blue-300 px-2 py-1 text-xs md:text-sm text-white rounded flex-shrink-0">Từ chối</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>


                <div className="w-full md:w-1/3 p-4 ml-5">
                    <h2 className="text-xl font-bold">
                        <i className="fas fa-hourglass-start mr-2"></i>
                        Đã gửi</h2>
                    <ul>
                        {receiver && receiver.map((request) => (
                            <li key={request.id} className="mt-1 flex items-center bg-gray-100 hover:bg-blue-200 cursor-pointer rounded p-2 mb-2 md:mb-0">
                                <img src={request.avatar} alt="" className="rounded-full w-8 h-8 ml-2" />
                <span onClick={()=>{
                    navigate("/profile/"+request.id)
                }} className="flex-grow whitespace-nowrap overflow-hidden truncate px-2 py-1" style={{ maxWidth: 'calc(100% - 10rem)' }}>
                    {request.firstname + " " + request.lastname}
                </span>

                                <button onClick={
                                    ()=>{
                                        AxiosClient.delete("/friend/reject", {
                                            params: {
                                                senderUserId: userlogged.id,
                                                receiverUserId: request.id
                                            }
                                        })
                                            .then(()=>{
                                                showSuccessAlert('Hủy thành công');
                                                const updateReceiverRequest = receiver.filter((item) => item.id !== request.id);
                                                setReceiver(updateReceiverRequest);
                                            }).catch()
                                    }
                                } className="mt-2 ml-2 w-30 mt-1 mb-1 flex-shrink-0 bg-blue-300 px-2 py-1 text-white rounded">
                                    Hủy lời mời
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="w-50 md:w-1/3 p-4 ml-5">
                    <h2 className="text-xl font-bold">
                        <i className={"fas fa-list-ul mr-2"}></i>
                        Danh sách bạn bè</h2>
                    {friend && <ul>
                        {friend.map((friend) => (
                            <li onClick={()=>{
                                navigate("/profile/"+friend.id)
                            }} key={friend.id} className="mt-1 flex items-center bg-gray-100 hover:bg-blue-200 cursor-pointer rounded p-2 mb-2 md:mb-0">
                                <img src={friend.avatar} alt="" className="w-10 h-10 rounded-full" />
                                <span className="flex-grow px-2 py-1">{friend.lastname + " " + friend.firstname}</span>


                            </li>
                        ))}
                    </ul>}
                </div>
            </div>

            <FooterDefaultLayout/>
        </>
    )

}