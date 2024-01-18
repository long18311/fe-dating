import HeaderDefaultLayout from "@/components/defaultlayout/HeaderDefaultLayout.jsx";
import "../../../styles/full.css"
import lovelink_avt from "@/assets/images/welcome/logo.png";
import profile11 from "@/assets/profile-11.jpg";
import profile2 from "@/assets/profile-2.jpg";
import profile13 from "@/assets/profile-13.jpg";
import Left from "@/pages/left.jsx";
import {useParams} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import axiosClient from "../../../apis/AxiosClient.js";
import {formatDistanceToNow} from "date-fns";

export default function PostDetail(){
    const {postId} = useParams();
    const [isLoad,setIsLoad] = useState(true);
    const [post, setPost] = useState({
        id: 0,
        user : {},
        title: "",
        content: "",
        createDate: "2023-12-14T09:03:20.000+00:00",
        images: [],
        islike: 0,
        userLikes: [],
        userDislikes: [],
    });
    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);
    useEffect(() => {
        axiosClient.get(`/post/get/id/${postId}`).then((res) => {
            setPost(res);
            setLiked(res.islike === 1);
            setDisliked(res.islike === 2);
            console.log(res);
        })
    }, [isLoad]);




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
    if (!post) {
        return <div>Loading...</div>;
    }
    return (
        <>
            <HeaderDefaultLayout />
            <div className="">
                <main className="top-10">
                    <div className="container">
                        <Left />
                        <div className="middle">
                            <div className="">
                                <div className="">
                                    <div className="feed">
                                        <div className="head">
                                            <div className="user">
                                                <div className="profile-photo">
                                                    <img src={post.user.avatar} alt="User Avatar" />
                                                </div>
                                                <div className="info">
                                                    <h3><b>{post.user.firstname} {post.user.lastname}</b></h3>
                                                    <small>{post.user.city}, {formatDistanceToNow(new Date(post.createDate))} ago</small>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="photos">
                                            {post.images.map((image, index) => (
                                                <img key={index} src={image.imageUrl} alt={`Post Image ${index}`} />
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
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}