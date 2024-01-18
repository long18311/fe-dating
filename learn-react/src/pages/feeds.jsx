
import feed1 from "../assets/feed-1.jpg";
import profile13 from "../assets/profile-13.jpg";
import profile11 from "../assets/profile-11.jpg";
import profile2 from "../assets/profile-2.jpg";
import lovelink_avt from "../assets/images/welcome/logo.png";
import { useState, useEffect, useRef} from "react";
import {NavLink, useNavigate, useParams} from 'react-router-dom';
import axiosClient from "../apis/AxiosClient.js";
import {Feed} from "../pages/Feed.jsx";


export default function Feeds (){

    const [posts, setPosts] = useState([]);
    const [isLoad, setIsLoad] = useState(false);

    useEffect(() => {
        axiosClient.get('/post/getAll').then((res) => {
            setPosts(res);
        })
    },[isLoad]);

    return (
        <div className={"overflow-y-scroll  h-[700px]"}>
        <div className={"feeds"}>
            {posts.map(post => (
                <Feed key={post.id} isLoad={isLoad} setIsLoad={setIsLoad} post={post}/>
            ))}
        </div>
        </div>
    )
}