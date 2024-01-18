import Contentpost from "./Contentpost/index.jsx";
import React, { useState, useEffect, useRef } from 'react';
import profile1 from "../assets/profile-1.jpg";
import "../styles/full.css"
import axiosClient from "../apis/AxiosClient.js";
export default function Post(props) {
    const { loading } = props;
    const [showContent, setShowContent] = useState(false);
    const formRef = useRef();
    const contentPostRef = useRef();
    const [inputValue, setInputValue] = useState('');
    const [checkAuthorities, setCheckAuthorities] = useState(null);
    const [userLogged,setUserloged] = useState(null)


    const toggleContent = () => setShowContent(!showContent);

    // Handle outside click
    const handleClickOutside = (event) => {
        if (formRef.current && !formRef.current.contains(event.target) &&
            contentPostRef.current && !contentPostRef.current.contains(event.target)) {
            setShowContent(false);
        }
    };
    const handleInputChange = (event) => {
        const newValue = event.target.value;
        // Chỉ cho phép cập nhật giá trị nếu nó là số
        if (/^[0-9]*$/.test(newValue)) {
            setInputValue(newValue);
        }
    };
    // function check admin
    function containsAdminRole(authorities) {
        return authorities.some(auth => auth.name === "ROLE_ADMIN");
    }


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


        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (

        <>
            {checkAuthorities &&
            <form className="create-post mb-5" ref={formRef}>
                <div className="profile-photo">
                    <img src={userLogged.avatar} alt="profile"/>
                </div>
                <input
                    onClick={toggleContent}
                    type="text"
                    placeholder={`Chào ${userLogged.lastname} , bạn đang suy nghĩ gì ?`}
                    id="create-post"
                    value={inputValue}
                    onChange={handleInputChange}
                />
                <input type="submit" value="Post" className="btn btn-primary"/>
            </form>
}
            {showContent &&  <div className="absolute">
                <Contentpost loading = {() =>(loading())}/>
            </div>}
        </>
    );
}
