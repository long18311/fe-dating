import Contentpost from "./Contentpost/index.jsx";
import React, { useState, useEffect, useRef } from 'react';
import profile1 from "../assets/profile-1.jpg";
import "../styles/full.css"
export default function Post() {
    const [showContent, setShowContent] = useState(false);
    const formRef = useRef();
    const contentPostRef = useRef();
    const [inputValue, setInputValue] = useState('');

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

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <>
            <form className="create-post mb-5" ref={formRef}>
                <div className="profile-photo">
                    <img src={profile1} alt="profile"/>
                </div>
                <input
                    onClick={toggleContent}
                    type="text"
                    placeholder="What's on your mind, Diana"
                    id="create-post"
                    value={inputValue}
                    onChange={handleInputChange}
                />
                <input type="submit" value="Post" className="btn btn-primary"/>
            </form>
            {showContent &&  <div className="absolute">
                <Contentpost/>
            </div>}
        </>
    );
}
