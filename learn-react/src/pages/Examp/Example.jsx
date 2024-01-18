
import "../Examp/index.css"
import Propose from './../Slide/Propose';
import About from './../welcome/About';
import {useNavigate} from "react-router-dom";
export default function Example(props) {
    const navigate = useNavigate();
    const{profile,nextSlide} = props;
    console.log(props.profile.myDistance)
    var ageDifMs = Date.now() -  new Date(profile.userCheckLocation.birthday).getTime();
    var ageDate = new Date(ageDifMs);
    var age = Math.abs(ageDate.getUTCFullYear() - 1970);


    return (
        <div className="photo-and-actions">
            <div className="photo">
                <img src={profile.userCheckLocation.avatar} alt="Backgroud"className="photo-img"/>
                <div className="photo-text">
                    <div className="photo-name-and-age">
                        <h2>{profile.userCheckLocation.firstname} {profile.userCheckLocation.lastname}</h2>
                        <h2>{age}</h2>
                    </div>
                    <div className="photo-bio">
                    {profile.userCheckLocation.About}
                    </div>
                    <div className="photo-bio mr-1">
                        <i className={"fa fa-map-marker mr-1"}></i>
                        {props.profile.myDistance < 1 ? "Cách bạn dưới 1km" :"Cách bạn "+ Number(props.profile.myDistance.toFixed(2)) + "km"  }
                    </div>
                    <div className="photo-bio mr-1">
                        <i className={"fa fa-map-marker mr-1"}></i>
                        {props.profile.userCheckLocation.district}
                    </div>
                    <div className="photo-bio">
                        <i className={"fa fa-map-marker mr-1"}></i>
                        {props.profile.userCheckLocation.city}
                    </div>
                </div>
            </div>
            <div className="actions">
                <div className="action" >
                    <i className="fas fa-times" onClick={nextSlide}></i>
                </div>
                <div className="action">
                    <i className="fas fa-star"></i>
                </div>
                <div onClick={()=>{navigate("/profile/"+profile.userCheckLocation.id);}} className="action">
                    <i className="fas fa-heart"></i>
                </div>
            </div>
        </div>
    )
}

