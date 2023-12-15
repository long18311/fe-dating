import {useEffect, useRef, useState} from "react";

import {NavLink} from "react-router-dom";

import axiosClient from "../apis/AxiosClient.js";

export function Feed(props) {
    const { post,isLoad,setIsLoad } = props;
    const [liked, setLiked] = useState(post.islike === 1);
    const [disliked, setDisliked] = useState(post.islike === 2);
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef();


    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mouseup', handleClickOutside);
        return () => {
            document.removeEventListener('mouseup', handleClickOutside);
        };
    }, []);

    const toggleLike = () => {
        if (liked=== false) {
            axiosClient.post(`/like/like/${post.id}`).then((res) => {
                setLiked(true);
                setDisliked(false);
                setIsLoad(!isLoad);
            })
        } else {
            axiosClient.delete(`/like/${post.id}`).then((res) => {
                setLiked(false);
                setDisliked(false);
                setIsLoad(!isLoad);
            })
        }


        // Add logic to send like or unlike to the server here
    };

    const toggleDislike = () => {
        if (disliked=== false){
        axiosClient.post(`/like/dislike/${post.id}`).then((res) => {
            setDisliked(true);
            setLiked(false);
            setIsLoad(!isLoad);
        })} else {
            axiosClient.delete(`/like/${post.id}`).then((res) => {
                setLiked(false);
                setDisliked(false);
                setIsLoad(!isLoad);
            })
        }

        // Add logic to send dislike or remove dislike to the server here
    };

    return (
        <div className="feed">
            <div className="head">
                <div className="user">
                    <div className="profile-photo">
                        <img src={post.user.avatar} alt="User Avatar" />
                    </div>
                    <div className="info">
                        <h3><b>{post.user.firstname} {post.user.lastname}</b></h3>
                        <small>{post.user.city}, {new Date(post.createDate).toLocaleString()}</small>
                    </div>
                </div>
                <div className="relative" ref={menuRef}>
                    <span className="edit cursor-pointer" onClick={toggleDropdown}>
                        <i className="uil uil-ellipsis-h"></i>
                    </span>
                    {isOpen && (
                        <div className="absolute right-0 mt-2 py-2 w-48 bg-gray-50 rounded-md shadow-xl z-20">
                            <NavLink to={`/postedit/${post.id}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Edit Post</NavLink>
                            <NavLink to={"/deletepost"} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Delete Post</NavLink>
                            <NavLink to={`/postdetail/${post.id}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">View</NavLink>
                        </div>
                    )}
                </div>
            </div>
            <div className="photos">
                {post.images.map(image => (
                    <img key={image.imageId} src={image.imageUrl} alt="Post" />
                ))}
            </div>
            <div className="action-buttons">
                <div className="interaction-buttons">
                    <span onClick={toggleLike}>
                        <i className={`uil uil-heart ${liked ? 'text-red-500' : 'text-black'}`}></i>
                    </span>
                    <span onClick={toggleDislike}>
                        <i className={`uil uil-thumbs-down ${disliked ? 'text-blue-500' : 'text-black'}`}></i>
                    </span>
                    <span><i className="uil uil-comment"></i></span>
                    <span><i className="uil uil-share"></i></span>
                </div>
                <div className="bookmark">
                    <span><i className="uil uil-bookmark"></i></span>
                </div>
            </div>
            <div className="liked-by">
                {post.userLikes.slice(0, 3).map(userLike => (
                    <span key={userLike.id}>
                        <img src={userLike.avatar} alt={userLike.username} />
                        <p>{userLike.username}</p>
                    </span>
                ))}
                {post.userLikes.length > 3 && (
                    <p>
                        Liked by <b>{post.userLikes[3].username}</b> and <b>{post.userLikes.length - 3} others</b>
                    </p>
                )}
                {post.userLikes.length <= 3 && post.userLikes.length > 0 && (
                    <p>
                        Liked by <b>{post.userLikes.map(userLike => userLike.username).join(', ')}</b>
                    </p>
                )}
            </div>
            <div className="liked-by">
                {post.userDislikes.slice(0, 3).map(userLike => (
                    <span key={userLike.id}>
                        <img src={userLike.avatar} alt={userLike.username} />
                        <p>{userLike.username}</p>
                    </span>
                ))}
                {post.userDislikes.length > 3 && (
                    <p>
                        Disliked by <b>{post.userDislikes[3].username}</b> and <b>{post.userDislikes.length - 3} others</b>
                    </p>
                )}
                {post.userDislikes.length <= 3 && post.userDislikes.length > 0 && (
                    <p>
                        Disliked by <b>{post.userDislikes.map(userLike => userLike.username).join(', ')}</b>
                    </p>
                )}
            </div>
            <div className="caption">
                <p><b>{post.user.firstname} {post.user.lastname}</b> {post.content} <span className="hash-tag">#{post.title}</span></p>
            </div>
            <div className="comments text-muted">View all {post.comments?.length || 0} comments</div>
        </div>
    );
}