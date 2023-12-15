import profile8 from "../assets/profile-8.jpg";
import profile9 from "../assets/profile-9.jpg";

export  default  function Story(){
    return (
        <div className="stories">
            <div className="story">
                <div className="profile-photo">
                    <img src={profile8}/>
                </div>
                <p className="name">Your Story</p>
            </div>
            <div className="story">
                <div className="profile-photo">
                    <img src={profile9}/>
                </div>
                <p className="name">YaSUO</p>
            </div>
            <div className="story">
                <div className="profile-photo">
                    <img src={profile9}/>
                </div>
                <p className="name">YaSUO</p>
            </div>
        </div>
    )
}