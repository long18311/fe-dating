
import "../Examp/index.css"
import Propose from './../Slide/Propose';
import About from './../welcome/About';
import {useNavigate} from "react-router-dom";
export default function Example(props) {
    const navigate = useNavigate();
    const{profile,nextSlide} = props;
    // console.log(profile);
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
                    <div className="photo-bio">
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

