import "../../styles/tailwindcss-colors.css"
import "../../styles/message.css"
import {useEffect, useRef, useState} from 'react';
import HeaderDefaultLayout from "../../components/defaultlayout/HeaderDefaultLayout.jsx";
import FooterDefaultLayout from "../../components/defaultlayout/FooterDefaultLayout.jsx";
import {UserChat} from "./userChat.jsx";
import {TitleMessage} from "./titleMessage.jsx";
import {checkToken} from "../../utils/index.js";
import axiosClient from "../../apis/AxiosClient.js";
import {MessageItem} from "./MessageItem.jsx";
import { useNavigate, useParams} from "react-router-dom";
import showErrorAlert from "../SwalAlert/showErrorAlert.jsx";
import Swal from "sweetalert2";
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import {jwtDecode} from "jwt-decode";
import {ACCESS_TOKEN} from "../../constants/index.js";
import logo from  '../../assets/images/welcome/logo-blur.png'



export default function Message() {

    const  navigate = useNavigate();
    let   {userId} = useParams();
    const [messages, setMessages] = useState([]);
    const [isDefaultActive, setIsDefaultActive] = useState(true);
    const [userchats, setUserchats] = useState([]);
    const [messagechat, setMessagechat] = useState("");
    const [userchat, setUserchat] = useState({ });
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const [audioUrl, setAudioUrl] = useState('');
    const [recordingTime, setRecordingTime] = useState(0);
    const mediaRecorderRef = useRef(null);
    const recordingIntervalRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const stompClient = useRef(null);


    useEffect(() => {
        const socket = new SockJS('http://localhost:8080/ws');
        stompClient.current = Stomp.over(socket);

        // stompClient.current.connect({}, function (frame) {
        //     // Có thể đăng ký nhận tin nhắn tại đây nếu cần
        // });
        stompClient.current.connect({}, function(frame) {
            // Sử dụng receiverId ở đây để đăng ký
            const token = localStorage.getItem(ACCESS_TOKEN);
            const decoded = jwtDecode(token);
            stompClient.current.subscribe(`/user/${Number(decoded.sub)}/queue/messages`, async function (message) {
                // console.log("Thông điệp đầy đủ:", message);
                // // Giả sử thông điệp thực tế là phần 'body' của đối tượng message
                // var actualMessage = JSON.parse(message.body);
                // console.log("Thông điệp thực tế:", actualMessage);

                // So sánh hoặc xử lý dữ liệu
                // const token = localStorage.getItem(ACCESS_TOKEN);
                // const decoded = jwtDecode(token);

                console.log("chưa vaoif");

                var actualMessage = JSON.parse(message.body);
                console.log("Thông điệp thực tế: ", actualMessage);
                console.log("userId ", userId);
                await getMeschat();
                console.log("vào roi");
                // if (JSON.parse(message.body) === Number(userId)) {
                //
                //
                //
                //     // Thực hiện hành động nếu thông điệp là số 2
                // }
                getUserchats();
            });
        });

        return () => {
            if (stompClient.current) {
                stompClient.current.disconnect();
            }
        };
    }, [])
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);


    // const sendMeschatBtnClick = () => {
    //     if(messagechat === null || messagechat === "" || userId === 0){
    //         console.log(userId);
    //         return;
    //     }
    //
    //
    //     //  axiosClient.get("userlogged").then(
    //     //     (res)=>{
    //     //        setUserLogged(res)
    //     //     }
    //     // ).catch()
    //
    //     if (checkToken()){
    //         navigate("/loginpage");
    //     } else {
    //
    //         // console.log(userLogged)
    //
    //         const messagePayload = {
    //             senderId :  10,
    //             receiverId: userId, // ID người nhận
    //             content: messagechat, // Nội dung tin nhắn
    //             // Có thể thêm thông tin khác nếu cần
    //         };
    //         // Gửi tin nhắn qua WebSocket
    //
    //         stompClient.current.send("/app/sendMessage", {}, JSON.stringify(messagePayload));
    //
    //         // Cập nhật UI sau khi gửi tin nhắn
    //         getMeschat(userId);
    //         getUserchats();
    //     }
    //
    //     setMessagechat("");
    // };

    useEffect(() => {
        // Dọn dẹp khi component unmount
        return () => {
            if (filePreview) {
                URL.revokeObjectURL(filePreview.url);
            }
        };
    }, [filePreview]);
    useEffect(() => {
        // Clear interval when component unmounts
        return () => {
            recordingIntervalRef.current && clearInterval(recordingIntervalRef.current);
        };
    }, []);
    useEffect( () => {
        if (userId !== undefined) {
             getMeschat();
            setIsDefaultActive(false);
            getUserchat();
        } else {
            setIsDefaultActive(true);
        }
        getUserchats();

    }, []);
    useEffect(() => {

        if (userId !== undefined) {
            setIsDefaultActive(false);
            getUserchat();
             getMeschat();
            getUserchats();
        } else {
            setIsDefaultActive(true);
        }

        getUserchats();

    }, [userId]);
    function isFileValid(file) {
        return new Promise((resolve, reject) => {
            if (file.type.match('image.*')) {
                // Xử lý file ảnh
                const img = new Image();
                img.onload = () => resolve(true);
                img.onerror = () => resolve(false);
                img.src = URL.createObjectURL(file);
            } else if (file.type.match('video.*')) {
                // Xử lý file video
                const video = document.createElement('video');
                video.onloadeddata = () => resolve(true);
                video.onerror = () => resolve(false);
                video.src = URL.createObjectURL(file);
            } else {
                // Nếu không phải ảnh hoặc video
                resolve(false);
            }
        });
    }
    const handleImgChange = () => {
        // Tạo một input type='file' ẩn
        console.log('handle')
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*,video/*'; // Chỉ chấp nhận file ảnh
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) {
                console.log('Không có file nào được chọn.');
                return;
            }


            // Kiểm tra MIME type của file
            if (file.type.match('image.*') || file.type.match('video.*')) {
                const isValidImage = await isFileValid(file);
                if (!isValidImage) {
                    showErrorAlert("error", "Lỗi", "File không phải là ảnh hợp lệ.");
                    return;
                }
                if (file.size < 5242880) {
                    // Xử lý file ảnh ở đây
                    console.log(URL.createObjectURL(file));
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
                        confirmButtonText: 'Gửi ảnh',
                        focusConfirm: false,
                        preConfirm: () => {

                            return file;
                        },
                    }).then(async (result) => {
                        console.log(result.isConfirmed)
                        if (result.isConfirmed) {
                            const formData = new FormData();
                            formData.append('file', result.value);
                            try {
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
                                const res = await axiosClient.post(`messages/upload-files/${userId}`, formData, {
                                    headers: {
                                        'Content-Type': 'multipart/form-data'
                                    }
                                });
                                await getMeschat();
                                getUserchats();
                                console.log(res)
                                Swal.close();
                                Swal.fire("Đã gửi");

                                // Reset trạng thái nếu cần
                                setSelectedFile(null);
                                setFilePreview(null);
                            } catch (error) {
                                // Xử lý lỗi từ phản hồi hoặc lỗi mạng
                                console.error('Lỗi khi tải lên:', error.response ? error.response.data : error.message);
                            }
                        }
                    });
                } else {
                    showErrorAlert("error", "Lỗi", "Đã vượt quá 5MB");
                }

            } else {
                showErrorAlert("error", "Lỗi", "File không phải là ảnh,video.");
            }
        };

        // Kích hoạt click event
        input.click();
    };


    const startRecording = async () => {
        // Yêu cầu quyền truy cập microphone
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        let audioChunks = [];

        mediaRecorder.ondataavailable = (event) => {
            audioChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            const audioUrl = URL.createObjectURL(audioBlob);
            setAudioBlob(audioBlob);
            setAudioUrl(audioUrl);
            // Dừng bộ đếm thời gian khi ghi âm dừng
            clearInterval(recordingIntervalRef.current);
            setRecordingTime(0);
        };

        mediaRecorder.start();
        setIsRecording(true);
        setRecordingTime(0);

        // Bắt đầu bộ đếm thời gian ghi âm
        recordingIntervalRef.current = setInterval(() => {
            setRecordingTime((prev) => prev + 1);
        }, 1000);

        // Đặt giới hạn thời gian ghi âm là 20 giây
        setTimeout(() => {
            // Chỉ dừng ghi âm nếu quá trình ghi âm vẫn đang diễn ra
            if (mediaRecorder && mediaRecorder.state === "recording") {
                mediaRecorder.stop();
                // Dừng bộ đếm thời gian khi tự động dừng ghi âm sau 20 giây
                clearInterval(recordingIntervalRef.current);
                setRecordingTime(0);
            }
        }, 20000); // 20000 milliseconds = 20 seconds
    };
    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
            mediaRecorderRef.current.stop();
        }
        setIsRecording(false);
        // Dừng bộ đếm thời gian cũng như reset thời gian ghi âm về 0
        clearInterval(recordingIntervalRef.current);
        setRecordingTime(0);
    };
    const cancleAudio = ()=>{
        setAudioBlob(null);
        setAudioUrl('');
        setRecordingTime(0);
        setIsRecording(false); // Đảm bảo cập nhật trạng thái ghi âm thành không ghi âm
    }
    // Hàm để gửi âm thanh đã ghi
    const sendAudio = async () => {
        const formData = new FormData();
        formData.append('audioFile', audioBlob, 'user-audio.wav'); // 'user-audio.wav' là tên file mà bạn muốn đặt, hoặc có thể để trống

        try {
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
            const response = await axiosClient.post(`/messages/upload/${userId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            Swal.close();
            Swal.fire("Đã gửi");
            getMeschat();
            getUserchats();
            console.log(response); // Response từ server
        } catch (error) {
            console.error('Lỗi khi gửi file âm thanh: ', error);
        }

        setAudioBlob(null);
        setAudioUrl('');
        setRecordingTime(0);
        setIsRecording(false); // Đảm bảo cập nhật trạng thái ghi âm thành không ghi âm


    };
    const getUserchat = () =>{

        if (checkToken()){
            navigate("/loginpage");
        } else{
            axiosClient.get(`/public/findUserNotDtoById?id=${userId}`).then((res) => {
                setUserchat(res)
            })
        }
    }
    const getUserchats = () =>{

        if (checkToken()){
            navigate("/loginpage");
        } else{
            axiosClient.get("/messages/user").then((res) => {
                setUserchats(res)
            })
        }
    }
    const getMeschat = async  () =>{
        if (checkToken()) {
            navigate("/loginpage");
        } else if (userId !== undefined){
            try {
                const res = await axiosClient.get(`/messages/${userId}`);
                setMessages(res);
            } catch (error) {
                console.error("Lỗi khi lấy tin nhắn: ", error);
                // Xử lý lỗi tại đây
            }
        }
    }
    const handleInputChange = (e) => {
        setMessagechat(e.target.value);
    }
    const sendMeschatBtnClick=()=>{

        if(messagechat === null || messagechat === ""|| userId === 0){
            console.log(userId);
            return;
        }

        if (checkToken()){
            navigate("/loginpage");
        } else {
            axiosClient.post(`/messages/${userId}`,{message : `${messagechat}`}).then(() => {
                getMeschat();
                getUserchats();

            })

        }
        getUserchats();
        setMessagechat("");

    }



    const recallMessage = (id) => {
        if (checkToken()) {
            navigate("/loginpage");
        } else {
            axiosClient.delete(`/messages/${id}`)
                .then(() => {
                    // Cập nhật trạng thái messages để loại bỏ tin nhắn đã xóa
                    // setMessages(previousMessages => previousMessages.filter(message => message.id !== id));
                    getMeschat(userId);
                    getUserchats();
                })
                .catch(error => {
                    // Xử lý lỗi ở đây, ví dụ: thông báo lỗi cho người dùng
                    console.error("Error deleting message:", error);
                });
        }
    };
    // Thêm hàm này để xử lý sự kiện nhấn phím
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // Ngăn chặn việc xuống dòng mới trong textarea
            sendMeschatBtnClick(); // Gọi hàm khi nhấn Enter
        }
    };
    return (
        <div>
            <HeaderDefaultLayout/>
            <section className="chat-section">
                <div className="chat-container">

                    <aside className="chat-sidebar">
                        <a href="#" className="chat-sidebar-logo">
                            <i className="ri-chat-1-fill"></i>
                        </a>
                        <ul className="chat-sidebar-menu">
                            <li className="active"><a href="#" data-title="Chats"><i className="ri-chat-3-line"></i></a>
                            </li>
                           </ul>
                    </aside>

                    <div className="chat-content">

                        <div className="content-sidebar">
                            <div className="content-sidebar-title">Chats</div>
                            <form action="" className="content-sidebar-form">
                                <input type="search" className="content-sidebar-input" placeholder="Search..."/>
                            </form>
                            <div className="content-messages">
                                <ul className="content-messages-list">
                                    <li className="content-message-title"><span>Recently</span></li>
                                    {userchats.sort((a, b) =>  new Date(b.time) - new Date(a.time)).map((u) => (
                                        <UserChat
                                            key={u.id} // Sử dụng u.id làm key để đảm bảo mỗi UserChat có một key duy nhất
                                            onClick={() => { navigate(`/message/${u.id}`); }}
                                            userChat={u}
                                        />
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className={`conversation conversation-default ${isDefaultActive ? 'active' : ''}`}>
                             <img className={"w-auto h-80"} src={logo}/>
                            <p>Select chat and view conversation!</p>
                        </div>
                        <div className={`conversation ${isDefaultActive ? '' : 'active'}`}>
                            <TitleMessage userChat={userchat}/>
                            <div className="conversation-main">
                                <ul className="conversation-wrapper">
                                    {Array.isArray(messages) && messages
                                        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
                                        .map((message, messageIndex) => (
                                            <MessageItem key={messageIndex} message={message} recallMessage={recallMessage} />
                                        ))}
                                    <div ref={messagesEndRef} />
                                </ul>
                            </div>
                            <div className="conversation-form">
                                <button type="button"  onClick={isRecording ? stopRecording : startRecording}>
                                    <i className={`fas fa-microphone text-blue-400 text-3xl mr-4 ${isRecording ? 'fas fa-microphone-slash text-3xl mr-4 text-red-500' : 'fas fa-microphone-alt text-3xl mr-4'}`}></i>
                                </button>
                                <button type="button"  onClick={() =>{ handleImgChange()}}>
                                    <i className="fas fa-camera text-3xl mr-3 text-blue-400 "></i>
                                </button>
                                {/*<label htmlFor="file-upload">*/}
                                {/*    <i className="fas fa-camera text-3xl mr-3 text-blue-400 "></i>*/}
                                {/*    <input id="file-upload" type="file" accept="image/*,video/*" className="hidden" onChange={handleFileSelectSecond} />*/}
                                {/*</label>*/}
                                {/*{filePreview && (*/}
                                {/*    <div className="flex items-center">*/}
                                {/*        {filePreview.type === 'image' ? (*/}
                                {/*            <img src={filePreview.url} alt="Preview" className=" ml-2 w-10 h-10 object-cover" />*/}
                                {/*        ) : (*/}
                                {/*            <video src={filePreview.url} controls className="ml-2 w-10 h-10"></video>*/}
                                {/*        )}*/}
                                {/*        <button*/}
                                {/*            onClick={removeSelectedFile}*/}
                                {/*            className=" ml-2 mr-2 bg-red-500 text-white p-1 rounded hover:bg-red-600 focus:outline-none focus:ring"*/}
                                {/*            aria-label="Remove file"*/}
                                {/*        >*/}
                                {/*            <i className="fas fa-times"></i>*/}
                                {/*        </button>*/}
                                {/*        <button*/}
                                {/*            className=" mr-2 bg-blue-500 text-white p-1 rounded hover:bg-blue-600 focus:outline-none focus:ring"*/}
                                {/*            aria-label="Send file"*/}
                                {/*            onClick={handleSubmit}*/}
                                {/*        >*/}
                                {/*            <i className="fas fa-paper-plane"></i>*/}
                                {/*        </button>*/}
                                {/*    </div>*/}
                                {/*)}*/}

                                <div className="conversation-form-group ">
                                     <textarea  className="conversation-form-input" rows="1"
                                               placeholder="Aa" value={messagechat}
                                               onChange={handleInputChange}
                                               onKeyDown={handleKeyDown} // Thêm sự kiện onKeyDown vào đây
                                     ></textarea>

                                        <div>
                                            {isRecording && (
                                                <div className="recording-ui">
                                                    {/* Hiển thị gợn sóng và bộ đếm thời gian ở đây */}
                                                    <div className="wavesurfer-container">
                                                        <div className="fake-wave"></div>
                                                    </div>
                                                    <div className={"text-gray-500 text-xs mt-3"}>Thời gian ghi âm: {recordingTime} giây</div>
                                                </div>
                                            )}
                                            {audioUrl && (
                                                <div className="audio-preview">
                                                    <audio src={audioUrl} controls />
                                                    <button className={"ml-2 bg-blue-600"} onClick={sendAudio}>
                                                         Gửi voice
                                                        <i className=" ml-2 fas fa-paper-plane text-gray"></i>
                                                    </button>
                                                    <button className={"ml-2 bg-red-600"} onClick={cancleAudio}>Hủy voice
                                                        <i className="ml-2 fas fa-times"></i>
                                                    </button>
                                                </div>

                                            )}
                                        </div>

                                </div>

                                {/*Khi nhấn enter sự kiện onclick trong button này sẽ được thực hiện*/}
                                <button type="button" className="" onClick={sendMeschatBtnClick}>
                                    <i className="fas fa-paper-plane mr-4 text-3xl text-blue-400" ></i>
                                </button>

                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <FooterDefaultLayout/>
        </div>
    )
}