import React, { useState } from 'react';
import { ACCESS_TOKEN, formatTimeVN } from "../../constants/index.js";
import {jwtDecode} from "jwt-decode"; // jwt-decode should be default imported

export const MessageItem = (props) => {
    const { message, recallMessage } = props;
    const [isActive, setIsActive] = useState(false); // State to handle dropdown visibility

    // Decode token to get user information
    const token = localStorage.getItem(ACCESS_TOKEN);
    const decoded = jwtDecode(token);
    const isSend = message.sender.id === Number(decoded.sub);

    // You can put your default avatar URL in constants for better management
    const avatar = message.sender.avatar || 'default-avatar-url';

    // Use formatTimeVN utility to format the timestamp
    const formattedTime = formatTimeVN(new Date(message.timestamp));

    // Toggle the dropdown active state
    const toggleDropdown = () => {
        setIsActive(!isActive);
    };
    const renderContent = () => {
        const content = message.content||'';
        const baseURL = 'http://res.cloudinary.com/ducauhnpz/';

        if (content.startsWith(`${baseURL}image/`)) {
            return <img className={"rounded-2xl w-80 h-auto"} src={content} alt="Message Image" />;
        } else if (content.startsWith(`${baseURL}video/`) && content.includes('/voice/')) {
            // Xử lý đặc biệt cho voice
            return <video className={"w-full  h-10"} src={content} controls />;

        } else if (content.startsWith(`${baseURL}video/`)) {
            // Xử lý cho video
            return <video className={"rounded-2xl w-80 h-auto"} src={content} controls />;
        } else {
            return <p>{content}</p>;
        }
    };

    return (
        <li className={`conversation-item ${isSend ? '' : 'me'}`}>
            <div className="conversation-item-side">
                <img className="conversation-item-image" src={avatar} alt="Sender Avatar" />
            </div>
            <div className="conversation-item-content">
                <div className="conversation-item-wrapper">
                    <div className="conversation-item-box">
                        <div className="conversation-item-text">
                            {/*<p>{message.content}</p>*/}
                            {renderContent()} {/* Sử dụng hàm renderContent ở đây */}
                            <div className="conversation-item-time">{formattedTime}</div>
                        </div>
                        <div className={`conversation-item-dropdown ${isActive ? 'active' : ''}`}>
                            <button type="button" className="conversation-item-dropdown-toggle" onClick={toggleDropdown}>
                                <i className="ri-more-2-line"></i>
                            </button>
                            <ul className={`conversation-item-dropdown-list ${isActive ? 'active' : ''}`}>
                                <li><a href="#"><i className="ri-share-forward-line"></i> Chuyển tiếp</a></li>
                                <li>
                                    <a href="#" onClick={() => recallMessage(message.id)}>
                                        <i className="ri-delete-bin-line"></i> Thu hồi
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </li>
    );
};