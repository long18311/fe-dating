import {formatTimeVN} from "../../constants/index.js";
import React from "react";

export const UserChat = (props) => {
    const { userChat,onClick } = props;
    const renderContent = () => {
        const content = userChat.content || '';
        const baseURL = 'http://res.cloudinary.com/ducauhnpz/';

        if (content.startsWith(`${baseURL}image/`)) {
            return  <span className="content-message-text">bạn có 1 hình ảnh </span>;
        } else if (content.startsWith(`${baseURL}video/`) && content.includes('/voice/')) {
            // Xử lý đặc biệt cho voice
            return <span className="content-message-text">bạn có 1 đoạn chát </span>;
        } else if (content.startsWith(`${baseURL}video/`)) {
            // Xử lý cho video
            return <span className="content-message-text">bạn có 1 video</span>;
        } else {
            return <span className="content-message-text">{userChat.content}</span>;
        }
    };

    return (
        <li
            className={`flex items-center p-3 hover:bg-gray-100 cursor-pointer ${userChat.numberUnread > 0 ? 'bg-red-100' : ''}`}
            onClick={onClick}
        >
            <a className={"flex items-center no-underline text-black "} style={{ width: '100%' }} data-conversation={`#conversation-${userChat.id}`}>
                <img className="content-message-image" src={userChat.img} alt=""/>
                <span className="content-message-info">
                    <span className="content-message-name">{userChat.username}</span>
                    {renderContent()} {/* Sử dụng hàm renderContent ở đây */}
                    {/*<span className="content-message-text">{userChat.content}</span>*/}
                </span>
                <span className="content-message-more">
                    {userChat.numberUnread > 0 &&
                        <span className="content-message-unread mr-3 ">{userChat.numberUnread}</span>}
                    <span className="content-message-time ">
                        {formatTimeVN(new Date(userChat.time)) } {/* Điều chỉnh thời gian dựa trên cột "time" */}
                    </span>
                </span>
            </a>
        </li>
    )
}
