import {useEffect, useRef, useState} from "react";
import LogoVerify from "../assets/images/verify.png"
import {NavLink} from "react-router-dom";
import LogoApp from "../assets/images/welcome/logo.png"
import axiosClient from "../apis/AxiosClient.js";

export function Feed(props) {
    const { post,loading } = props;
    const [liked, setLiked] = useState(post.islike === 1);
    const [disliked, setDisliked] = useState(post.islike === 2);
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef();
    const [checkAuthorities, setCheckAuthorities] = useState(null);
    const [userLogged,setUserloged] = useState(null)


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
                loading();
            })
        } else {
            axiosClient.delete(`/like/${post.id}`).then((res) => {
                setLiked(false);
                setDisliked(false);
                loading();
            })
        }


        // Add logic to send like or unlike to the server here
    };

    const toggleDislike = () => {
        if (disliked=== false){
        axiosClient.post(`/like/dislike/${post.id}`).then((res) => {
            setDisliked(true);
            setLiked(false);
            loading();
        })} else {
            axiosClient.delete(`/like/${post.id}`).then((res) => {
                setLiked(false);
                setDisliked(false);
                loading();
            })
        }

        // Add logic to send dislike or remove dislike to the server here
    };

    useEffect(() => {

        axiosClient.get("/userlogged").then(

            (res)=>{
                //res trả về
                setCheckAuthorities(containsAdminRole(res.authorities))
                setUserloged(res)
            }
        ).catch(
            (err)=>{}
        )
    }, []);

    // function check admin
    function containsAdminRole(authorities) {
        return authorities.some(auth => auth.name === "ROLE_ADMIN");
    }

    return (
        <div className="feed">
            <div className="head">
                <div className="user">
                    <div className="profile-photo">
                        <img src={LogoApp} alt="User Avatar" />
                    </div>
                    <div className="info">
                        <h3 className={"flex items-center"}>
                            <b> LOVELINK (Hẹn hò trực tuyến)
                            </b>
                            <img className={"w-3 h-3 ml-1"} src={LogoVerify} alt="" />
                        </h3>

                        <small>{post.user.city}, {new Date(post.createDate).toLocaleString()}</small>
                    </div>

                </div>
                <div className="relative" ref={menuRef}>
                    <span className="edit cursor-pointer" onClick={toggleDropdown}>
                        <i className="uil uil-ellipsis-h"></i>
                    </span>
                    {isOpen && (
                        <div className="absolute right-0 mt-2 py-2 w-48 bg-gray-50 rounded-md shadow-xl z-20">
                            {checkAuthorities && <NavLink to={`/postedit/${post.id}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Edit Post</NavLink>}
                            {checkAuthorities && <NavLink to={"/deletepost"} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Delete Post</NavLink>}
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
                        <p>{userLike.firstname} {userLike.lastname}</p>
                    </span>
                ))}
                {post.userLikes.length > 3 && (
                    <p>
                        Liked by <b>{post.userLikes[3].firstname} {post.userLikes[3].lastname}</b> and <b>{post.userLikes.length - 3} others</b>
                    </p>
                )}
                {post.userLikes.length <= 3 && post.userLikes.length > 0 && (
                    <p>
                        Liked by <b>{post.userLikes.map(userLike => `${userLike.firstname} ${userLike.lastname}`).join(', ')}</b>
                    </p>
                )}
            </div>
            <div className="liked-by">
                {post.userDislikes.slice(0, 3).map(userDislike => (
                    <span key={userDislike.id}>
                        <img src={userDislike.avatar} alt={userDislike.username} />
                        <p>{userDislike.firstname} {userDislike.lastname}</p>
                    </span>
                ))}
                {post.userDislikes.length > 3 && (
                    <p>
                        Disliked by <b>{post.userDislikes[3].firstname} {post.userDislikes[3].lastname}</b> and <b>{post.userDislikes.length - 3} others</b>
                    </p>
                )}
                {post.userDislikes.length <= 3 && post.userDislikes.length > 0 && (
                    <p>
                        Disliked by <b>{post.userDislikes.map(userDislike => `${userDislike.firstname} ${userDislike.lastname}`).join(', ')}</b>
                    </p>
                )}
            </div>
            <div className="caption">
                <p><b>{post.user.firstname} {post.user.lastname}</b> {post.content} <b className="hash-tag">#{post.title}</b></p>
            </div>
            <div className="comments text-muted">View all {post.comments?.length || 0} comments</div>
        </div>
    );
}