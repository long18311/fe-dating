import * as React from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import {ACCESS_TOKEN, APP_ID, SERVER_SECRET} from "../../constants/index.js";
import HeaderDefaultLayout from "../../components/defaultlayout/HeaderDefaultLayout.jsx";
import FooterDefaultLayout from "../../components/defaultlayout/FooterDefaultLayout.jsx";
import {useEffect, useRef} from "react";
import {checkToken} from "../../utils/index.js";
import axiosClient from "../../apis/AxiosClient.js";
import {useNavigate} from "react-router-dom";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import {jwtDecode} from "jwt-decode";
import Swal from "sweetalert2";


function randomID(len) {
    let result = '';
    if (result) return result;
    var chars = '12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP',
        maxPos = chars.length,
        i;
    len = len || 5;
    for (i = 0; i < len; i++) {
        result += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return result;
}

export function getUrlParams(
    url = window.location.href
) {
    let urlStr = url.split('?')[1];
    return new URLSearchParams(urlStr);
}

export default function Meet() {
    const  navigate = useNavigate();
    const roomID = getUrlParams().get('roomID') || randomID(5);
    const userID = Number(getUrlParams().get('userID')) || 0;
    const userCallId = Number(getUrlParams().get('userCallId')) || 0;
    const stompClient = useRef(null);
    useEffect(() => {
        //
        if (userID > 0 && getUrlParams().get('roomID') === null){
            if (checkToken()){
                navigate("/loginpage");
            } else{
                console.log("thành công 1")
                axiosClient.post(`/messages/meet/${userID}`,{message : `${roomID}`}).then((res) => {
                    console.log("thành công 2")
                })
            }
        }
        if(userCallId > 0 && userID > 0 && !(getUrlParams().get('roomID') === null)){
            if (checkToken()){
                navigate("/loginpage");
            } else{
                axiosClient.post(`/messages/joinmeet/${userCallId}`,{message : `${roomID}`}).then((res) => {
                    console.log("Notification received:", res);
                })
            }
        }
    },[]);
    useEffect(() => {
        const socket = new SockJS('http://localhost:8080/ws');
        stompClient.current = Stomp.over(socket);
        stompClient.current.connect({}, function(frame) {
            // Sử dụng receiverId ở đây để đăng ký
            const token = localStorage.getItem(ACCESS_TOKEN);
            const decoded = jwtDecode(token);
            stompClient.current.subscribe(`/user/${Number(decoded.sub)}/queue/joinmeet`,  function (incomingMessage) {

                console.log("Notification received:", incomingMessage);

                // Assuming the message body is a string "id:message"
                const messageBody = incomingMessage.body;
                const [id, message] = messageBody.split(':');
                if(message === roomID){
                    axiosClient.get(`/profile/${id}`).then((res) => {
                        Swal.fire({
                            icon: 'success',
                            title: 'thành công!',
                            text: `người dùng ${res.lastname} ${res.firstname} đã sẵn sàng thanh gia`,
                            customClass: {
                                popup: 'custom-popup-class', // Sử dụng lớp CSS cho kích thước popup
                                content: 'custom-content-class', // Sử dụng lớp CSS cho nội dung hộp thoại
                            },
                        });
                    })

                }
            });

        });
        return () => {
            if (stompClient.current) {
                stompClient.current.disconnect();
            }
        };
    }, []);

    let myMeeting = async (element = null) => {
        // generate Kit Token
        const appID = APP_ID;
        const serverSecret = SERVER_SECRET;

        const kitToken =  ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, "anhbanthien",  randomID(5),  "Tên của bạn ?");


        // Create instance object from Kit Token.
        const zp = ZegoUIKitPrebuilt.create(kitToken);
        // start the call
        zp.joinRoom({
            container:  element,
            sharedLinks: [
                {
                    name: 'Tham gia trò chuyện',
                    url:
                        window.location.host + window.location.pathname +'?roomID=' +roomID,
                },
            ],
            scenario: {
                mode: ZegoUIKitPrebuilt.OneONoneCall,
            },

        });



    };

    return (
        <div>
            <div
                ref={myMeeting}
                className="w-screen h-screen "
            >
            </div>

        </div>
    );
}