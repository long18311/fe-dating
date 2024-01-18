
import hand from "../../assets/images/basic/waving-hand.png"

import "../basic/index.css"
import {useState} from "react";
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
                        <img  src={profile.avatar} alt="Background" className="front-background "/>
                            <h2>{profile.firstname} {profile.lastname}</h2>
                            <p>{profile.city} {profile.ward} {profile.district}</p>
                            <button onClick={()=>{navigate("/profile/"+profile.id);}}>Click me</button>
                    </div>
                    <div className="back box-border ">
                        <img src={hand} alt=""/>
                            <h1>{profile.lastname}</h1>

                            <p><span> </span>{profile.about} </p>
                            <div className="row">

                                <div className="col">

                                    <p>Ảnh nổi bật</p>
                                </div>
                                <div className="col">

                                    <p>Tương hợp</p>
                                </div>
                            </div>
                            <div className="row">
                                <button className={"bg-blue-600"}>Xem profile</button>

                            </div>
                    </div>
                </div>
            </div>
                <div className="buttons-propose">

                    <div onClick={()=>{navigate("/profile/"+profile.id);}} className="heart-propose">
                        <i className="fas fa-star fa"></i>
                    </div>
                </div>
            </div>



    )
}