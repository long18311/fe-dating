
import imgs from "../../assets/images/basic/user.png"
import hand from "../../assets/images/basic/waving-hand.png"
import ins from "../../assets/images/basic/instagram.png"
import "../basic/index.css"
import {useState} from "react";
import About from './../welcome/About';
import {useNavigate} from "react-router-dom";
export default function Basic(props){
    const  navigate = useNavigate();
    const { profile } = props;
    console.log (profile);
    const [flipped, setFlipped] = useState(false);
    const handleClick = () => {
        setFlipped(!flipped);
    };
    return(

            <div className="card"  >
                <div className={`card-inner ${flipped ? 'flipped' : ''}`}>
                <div className="card-inner" onClick={handleClick}>
                    <div className="front" >
                        <img  src={profile.user.avatar} alt="Background" className="front-background "/>
                            <h2>{profile.user.firstname} {profile.user.lastname}</h2>
                            <p>{profile.user.city} {profile.user.ward} {profile.user.district}</p>

                            <button onClick={()=>{navigate("/profile/"+profile.user.id);}}>hover me</button>
                    </div>
                    <div className="back box-border ">
                        <img src={hand} alt=""/>
                            <h1>{profile.user.firstname}</h1>

                            <p>{profile.user.About} <span>@fpt</span></p>
                            <div className="row">
                                <div className="col">
                                    <h2>12K</h2>
                                    <p>Follower</p>
                                </div>
                                <div className="col">
                                    <h2>250</h2>
                                    <p>Following</p>
                                </div>
                                <div className="col">
                                    <h2>12K</h2>
                                    <p>Likes</p>
                                </div>
                            </div>
                            <div className="row">
                                <button>follow</button>
                                <a href="#"><img src={ins} alt=""/></a>
                                <a href="#"><img src={ins} alt=""/></a>
                            </div>
                    </div>
                </div>
            </div>
                <div className="buttons-propose">
                    <div className="no-propose">
                        <i className="fas fa-times"></i>
                    </div>
                    <div className="star-propose">
                        <i className="fas fa-star fa"></i>
                    </div>
                    <div onClick={()=>{navigate("/profile/"+profile.user.id);}} className="heart-propose">
                        <i className="fas fa-heart"></i>
                    </div>
                </div>
            </div>



    )
}