
import Story from "./story.jsx";
import Post from "./post.jsx";
import Feeds from "./feeds.jsx";
import React, {useEffect, useState} from "react";
import axiosClient from "../apis/AxiosClient.js";
import {Feed} from "./Feed.jsx";
import {TYPE_POSTS} from "../constants/index.js";

export  default  function Middle(){
    const [posts, setPosts] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    const [type, setType] = useState("getAll");


    useEffect(() => {
        axiosClient.get(`/post/get/${type}`).then((res) => {
            setPosts(res);
        })
    },[isLoad,type]);

    const loading = () =>{
        console.log("check")
        setIsLoad(!isLoad);
    }
    return(
        <div className={"middle"}>
        <Post loading ={loading}/>
            <div className="mb-2  ">
                <select
                    id="type"
                    value={type}
                    onChange={(e) => {
                        setType(e.target.value);
                    }}
                    className="w-full p-2 border rounded-md bg-white shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                > <option value="getAll">
                  Địa điểm hẹn hò. ( Tất cả )
                </option>
                    {
                        TYPE_POSTS.map((type,index) =>(
                            <option key={index} value={type}>{type}</option>
                        ))
                    }

                </select>
            </div>
            <div className={"overflow-y-scroll  h-[700px]"}>
                <div className={"feeds"}>
                    {posts.map(post => (
                        <Feed key={post.id} loading={loading} post={post}/>
                    ))}
                </div>
            </div>
        </div>
    )
}