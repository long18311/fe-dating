import Notification from "./notification.jsx";
import {useState} from "react";

export  default function Sidebar(){
    const [activeItem, setActiveItem] = useState ('');
    const [showNotifications, setShowNotifications] = useState(false);

    const handleItemClick = (item) => {
        if (item === 'notifications') {
            // Chuyển đổi trạng thái hiển thị của thông báo
            setShowNotifications(prev => !prev);
        } else {
            // Ẩn thông báo nếu click vào item khác
            setShowNotifications(false);
        }
        setActiveItem(item);
    };
    return (
        <div className="sidebar">
            <a
                className={`menu-item ${activeItem === 'home' ? 'active' : ''}`}
                onClick={() => handleItemClick('home')}
            >
                <span><i className="uil uil-home"></i></span>
                <h3>Home</h3>
            </a>
            <a className={`menu-item ${activeItem === 'explore' ? 'active' : ''}`}
               onClick={() => handleItemClick('explore')}>
                <span><i className="uil uil-compass"></i></span>
                <h3>Explore</h3>
            </a>
            <a
                className={`menu-item ${activeItem === 'notifications' ? 'active' : ''}`}
                onClick={() => handleItemClick('notifications')}
                id="notifications"
            >
                <span><i className="uil uil-bell"><small className="notification-count">9+</small></i></span>
                <h3>Notifications</h3>
            </a>

            {showNotifications && <Notification/>}

            <a className={`menu-item ${activeItem === 'message' ? 'active' : ''}`}
               onClick={() => handleItemClick('message')}>
                <span><i className="uil uil-envelope"><small className="notification-count">6</small></i></span>
                <h3>Message</h3>
            </a>
            <a className="menu-item">
                <span><i className="uil uil-bookmark"></i></span>
            <h3>Bookmarks</h3>
           </a>
            <a className={"menu-item"}>
                <span><i className="uil uil-chart-line"></i></span>
                <h3>Analytics</h3>
            </a>
            <a className="menu-item" id="theme">
                <span><i className="uil uil-moon"></i></span>
                <h3>Theme</h3>
            </a>
            <a className="menu-item">
                <span><i className="uil uil-setting"></i></span>
                <h3>Settings</h3>
            </a>
       </div>
    )
}