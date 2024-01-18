import {Fragment, useEffect, useState,useRef} from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import {NavLink, useNavigate} from 'react-router-dom';
import { ListRouters } from '../../routers/index.js';
import { ACCESS_TOKEN } from '../../constants/index.js';
import axiosClient from "../../apis/AxiosClient.js";
import { formatDistanceToNow, parseISO } from 'date-fns';
import logo from '../../assets/images/welcome/logo.png';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import {jwtDecode} from "jwt-decode";
import FileAudio from "../../assets/mp3/super-shy-iphone-nhacchuongviet.com.mp3"
import Swal from 'sweetalert2';
const navigation = [];

ListRouters.map((item) => navigation.push({ name: item.name, href: item.path , icon: item.icon}));
const handleLogout = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    window.location.href = 'http://localhost:5173/welcome';

};

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function HeaderDefaultLayout() {

    const [userLogged, setUserLogged] = useState(null);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [page, setPage] = useState(0); // Bắt đầu từ trang 0
    const pageSize = 10; // Kích thước trang, tức là số lượng thông báo được tải mỗi lần
    const notificationButtonRef = useRef(null);
    const [unreadCount,setUnreadCount] = useState();
    const [unreadMessage,setUnreadMessage] = useState();
    const notificationContainerRef = useRef(null);
    const navigate = useNavigate();
    const stompClient = useRef(null);
    const [checkAuthorities, setCheckAuthorities] = useState(null);




    useEffect(() => {
        const socket = new SockJS('http://localhost:8080/ws');
        stompClient.current = Stomp.over(socket);
        stompClient.current.connect({}, function(frame) {
            // Sử dụng receiverId ở đây để đăng ký
            const token = localStorage.getItem(ACCESS_TOKEN);
            const decoded = jwtDecode(token);
            stompClient.current.subscribe(`/user/${Number(decoded.sub)}/queue/notifications`,  function (message) {
                 axiosClient.get(`unread-count?recipientId=${Number(decoded.sub)}`).then((res) => {
                     setUnreadCount(res);
                 })
                console.log("thông báo");
            });
            stompClient.current.subscribe(`/user/${Number(decoded.sub)}/queue/messages`,  function (message) {
                axiosClient.get(`/messages/numberNotification`).then((res) => {
                    setUnreadMessage(res);
                })
                console.log("thông báo");
            });
            stompClient.current.subscribe(`/user/${Number(decoded.sub)}/queue/meet`,  function (incomingMessage) {
                console.log("Notification received:", incomingMessage);

                // Assuming the message body is a string "id:message"
                const messageBody = incomingMessage.body;
                const [id, message] = messageBody.split(':');

                if (id){
                    showAlert(Number(decoded.sub),id, message)
                }

            });
        });
        return () => {
            if (stompClient.current) {
                stompClient.current.disconnect();
            }
        };
    }, []);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                notificationButtonRef.current && !notificationButtonRef.current.contains(event.target) &&
                notificationContainerRef.current && !notificationContainerRef.current.contains(event.target)
            ) {
                setShowNotifications(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    const  formatNotificationTime = (timestamp) =>  {
        const date = parseISO(timestamp);
        const now = new Date();

        // Kiểm tra nếu là cùng một ngày
        if (now.toDateString() === date.toDateString()) {
            return `${date.getHours()}:${date.getMinutes()}`;
        }

        // Trả về khoảng cách thời gian
        return formatDistanceToNow(date, { addSuffix: true });
    }
    const fetchNotifications = async (page = 0) => {
        try {
            const response = await axiosClient.get(`/notifications?userId=${userLogged.id}&page=${page}&size=${pageSize}`);
            const newNotifications = response.content; // Dữ liệu thông báo từ API
            setNotifications(newNotifications)
            console.log(newNotifications)       

        } catch (error) {
            console.error("Lỗi khi lấy thông báo:", error);
        }
    };

    const loadMoreNotifications = () => {
        fetchNotifications(page + 1);
        setPage(prev => prev + 1);
    };

    useEffect(() => {
        if (showNotifications && userLogged) {
            fetchNotifications(); // Tải dữ liệu thông báo khi component được mount và userLogged có giá trị
        }
    }, [showNotifications, userLogged]);

    useEffect(() => {
        const handleScroll = (e) => {
            const target = e.target;
            if (target.scrollHeight - target.scrollTop === target.clientHeight) {
                loadMoreNotifications(); // Tải thêm dữ liệu khi cuộn đến cuối danh sách
            }
        };

        const notificationDiv = document.querySelector('.notification-list');
        if (notificationDiv) {
            notificationDiv.addEventListener('scroll', handleScroll);
            return () => notificationDiv.removeEventListener('scroll', handleScroll);
        }
    }, [notifications, page]);
    // function check admin
    function containsAdminRole(authorities) {
        return authorities.some(auth => auth.name === "ROLE_ADMIN");
    }


    useEffect(() => {
        const fetchData = async () => {
            try {
                // luồng 1
                const userLoggedResponse = await axiosClient.get("/userlogged");
                setUserLogged(userLoggedResponse);
                setCheckAuthorities(containsAdminRole(userLoggedResponse.authorities))

                //luồng 2
                const unreadCountResponse = await axiosClient.get(`unread-count?recipientId=${userLoggedResponse.id}`);
                setUnreadCount(unreadCountResponse);
                axiosClient.get(`/messages/numberNotification`).then((res) => {
                    setUnreadMessage(res);
                })
            } catch (error) {
                handleLogout()
            }
        };

        fetchData();
    }, []);


    const showAlert = (iddangnhap,id,message) => {


        const ringtone = new Audio(FileAudio);
        ringtone.play();
        const stopRingtone = () => {
            ringtone.pause();
            ringtone.currentTime = 0;
        };
        axiosClient.get(`/profile/${id}`).then((res) => {
            Swal.fire({
                title: 'Cuộc gọi đến',
                text:  `Bạn có cuộc gọi từ ${res.lastname} ${res.firstname}, bạn có muốn trả lời không?`,
                iconHtml: '<i class="fa fa-phone"></i>',
                showCancelButton: true,
                confirmButtonText: 'Đồng ý',
                cancelButtonText: 'Từ chối',
                timer: 60000,
                willClose: () => {
                    console.log('Đã đóng');
                    stopRingtone();
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    console.log(true);
                    const windowFeatures = `menubar=no,toolbar=no,status=no,width=${1200},height=${1000},top=${window.top.outerHeight / 2 + window.top.screenY - 500},left=${window.top.outerWidth / 2 + window.top.screenX - 600}`;
                    const newTab = window.open(`http://localhost:5173/meet?roomID=${message}&userID=${iddangnhap}&userCallId=${id}`, '_blank', windowFeatures);

                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    console.log(false);
                } else if (result.dismiss === Swal.DismissReason.timer) {
                    console.log('Đã đóng');
                }
                stopRingtone();
            });
            console.log(res);
        })


    }

    return (
        <Disclosure as="nav" className="bg-gray-800">
            {({ open }) => (
                <>
                    <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                        <div className="relative flex h-16 items-center justify-between">
                            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                                {/* Mobile menu button */}
                                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                    <span className="absolute -inset-0.5" />
                                    <span className="sr-only">Open main menu</span>
                                    {open ? (
                                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                    ) : (
                                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                                    )}
                                </Disclosure.Button>
                            </div>
                            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                                <div className="flex flex-shrink-0 items-center">
                                    <img
                                        className="w-auto h-14 float-left"
                                        src={logo}
                                        alt="Your Company"
                                    />
                                </div>
                                <div className="hidden sm:ml-6 sm:block">
                                    <div className="flex space-x-4">
                                        {navigation.map((item) => (
                                            <NavLink
                                                key={item.name}
                                                to={item.href}
                                                className={classNames(
                                                    item.current ? `bg-gray-900 text-white mt-1 ${item.icon}` : 'text-gray-300 hover:bg-gray-700 hover:text-white ${item.icon} mt-1',
                                                    'rounded-md px-3 py-2 text-sm font-medium mt-1'
                                                )}
                                                aria-current={item.current ? 'page' : undefined}
                                            >   <i className={`mr-3 ${item.icon}`}></i>
                                                {item.name}

                                            </NavLink>
                                        ))}


                                    </div>
                                </div>
                            </div>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 ml-20">

                                <div className="relative">
                                    <NavLink

                                        to= '/message'
                                        className={classNames(
                                            'rounded-md px-5 py-5 text-sm font-medium mt-1 text-gray-300 hover:bg-gray-700 hover:text-white'
                                        )}
                                        aria-current= 'page'
                                    >       {
                                        // Giả sử bạn có một biến state là unreadCount để lưu số lượng thông báo chưa đọc
                                        unreadMessage > 0 &&
                                        <span className="mt-1 absolute inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">{unreadMessage}</span>
                                    }<i className='mr-3 fab fa-facebook-messenger text-2xl'></i>

                                    </NavLink>

                                    <button
                                        type="button"
                                        className="relative  rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                                        onClick={() => setShowNotifications(!showNotifications)}
                                        ref={notificationButtonRef}
                                    >
                                        <span className="absolute -inset-1.5" />
                                        <span className="sr-only">View notifications</span>
                                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                                    </button>
                                    {
                                        // Giả sử bạn có một biến state là unreadCount để lưu số lượng thông báo chưa đọc
                                        unreadCount > 0 &&
                                        <span className="absolute mt-1 mr-1 top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">{unreadCount}</span>
                                    }

                                    {showNotifications && (
                                        <div className="absolute top-full right-0 mt-5 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 overflow-hidden z-10 max-h-80 overflow-y-scroll notification-list">
                                            <p onClick={()=>{
                                                axiosClient.put(`mark-all-as-read?recipientId=${userLogged.id}`)
                                                    .then(() => {
                                                        setUnreadCount(0);
                                                        const updatedNotifications = notifications.map(notification => {
                                                            return {...notification, status: "1"};
                                                        });
                                                        setNotifications(updatedNotifications);
                                                    });
                                                setUnreadCount(0)
                                            }} className="text-center py-2 cursor-pointer hover:underline">
                                                <i className="fas fa-bell mr-2 "></i>
                                                Đánh dấu tất cả là đã đọc</p>
                                            {notifications.length > 0 ? (
                                                <ul className="divide-y divide-gray-200">
                                                    {notifications.map((notification, index) => (
                                                        <div key={index} className="px-4 py-2 text-sm">
                                                            <div  className={`flex items-start space-x-4 p-4 border rounded ${Number(notification.status) === 0 ? 'bg-red-200' : ''}`}>
                                                                <div className="w-12 h-12 flex-shrink-0">
                                                                    <img onClick={()=>{navigate("/profile/"+notification.sender.id)}} src={notification.sender.avatar} className="w-full h-full rounded-full" />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <p className="text-sx">{notification.message}</p>
                                                                    <p className="text-sm text-gray-500">{formatNotificationTime(notification.timestamp)}</p>
                                                                    {Number(notification.status) === 0 && <p onClick={()=>{
                                                                        axiosClient.put(`mark-as-read/${notification.id}?recipientId=${userLogged.id}`)
                                                                            .then(() => {
                                                                                const updatedNotifications = notifications.map(n => {
                                                                                    if (n.id === notification.id) {
                                                                                        return {...n, status: "1"};
                                                                                    }
                                                                                    return n;
                                                                                });
                                                                                setNotifications(updatedNotifications);
                                                                                setUnreadCount(prevCount => Math.max(prevCount - 1, 0));

                                                                            });
                                                                         }} className={"cursor-pointer hover:underline mt-3 font-bold"}>
                                                                     Đánh dấu là đã đọc
                                                                   </p>}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="text-center py-2 ">Chưa có dữ liệu thông báo.</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                                {/* Profile dropdown */}
                                <Menu as="div" className="relative ml-3">
                                    <div>
                                        <Menu.Button className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                            <span className="absolute -inset-1.5" />
                                            <span className="sr-only">Open user menu</span>
                                            {userLogged && <img className="h-8 w-8 rounded-full" src={userLogged.avatar} alt="" />}
                                        </Menu.Button>
                                    </div>
                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                    >
                                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <NavLink
                                                        to="/profilepage"
                                                        className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                                    >
                                                        <i className="fa fa-user mr-2"></i>
                                                        Profile
                                                    </NavLink>
                                                )}
                                            </Menu.Item>

                                            { checkAuthorities &&
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <NavLink
                                                       to={"/cms"}
                                                        className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                                    ><i className="fas fa-user-cog mr-2"></i>

                                                       Hộp thư mạo danh
                                                    </NavLink>
                                                )}
                                            </Menu.Item>
                                            }
                                            { checkAuthorities &&
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <NavLink
                                                       to={"/cms2"}
                                                        className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                                    ><i className="fas fa-user-cog mr-2"></i>

                                                        Hộp thư quấy rối
                                                    </NavLink>
                                                )}
                                            </Menu.Item>
                                            }
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <a

                                                        className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                                        onClick={handleLogout}
                                                    >  <i className="fas fa-sign-out-alt mr-2"></i>
                                                        Sign out
                                                    </a>
                                                )}
                                            </Menu.Item>
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                            </div>
                        </div>
                    </div>

                    <Disclosure.Panel className="sm:hidden">
                        <div className="space-y-1 px-2 pb-3 pt-2">
                            {navigation.map((item) => (
                                // Thay thế Disclosure.Button bằng NavLink
                                <NavLink
                                    key={item.name}
                                    to={item.href}
                                    className={classNames(
                                        item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                        'block rounded-md px-3 py-2 text-base font-medium'
                                    )}
                                    aria-current={item.current ? 'page' : undefined}
                                >
                                    {item.name}
                                </NavLink>
                            ))}
                        </div>
                    </Disclosure.Panel>

                </>
            )}
        </Disclosure>
    );
}
