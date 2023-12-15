import profile2 from "../assets/profile-2.jpg"
import profile3 from "../assets/profile-3.jpg"
import profile4 from "../assets/profile-4.jpg"
import profile5 from "../assets/profile-5.jpg"
import profile6 from "../assets/profile-6.jpg"

export default function Notification(){
    return(
        <div className="notifications-popup">
            <div>
                <div className="profile-photo">
                    <img src={profile2}/>
                </div>
                <div className="notification-body">
                    <b>Keke Benjamin</b> accepted your frined request
                    <small className="text-muted">2 DAYS AGO</small>
                </div>
            </div>
            <div>
                <div className="profile-photo">
                    <img src={profile3}/>
                </div>
                <div className="notification-body">
                    <b>Rô béo</b> commented on your post
                    <small className="text-muted">2 DAYS AGO</small>
                </div>
            </div>
            <div>
                <div className="profile-photo">
                    <img src={profile4}/>
                </div>
                <div className="notification-body">
                    <b>ĐỖ Nam TRUNG</b> commented on your post
                    <small className="text-muted">1 HOURS AGO</small>
                </div>
            </div>
            <div>
                <div className="profile-photo">
                    <img src={profile5}/>
                </div>
                <div className="notification-body">
                    <b>YaSUO</b> HASAGi BẠN
                    <small className="text-muted">1 HOURS AGO</small>
                </div>
            </div>
            <div>
                <div className="profile-photo">
                    <img src={profile6}/>
                </div>
                <div className="notification-body">
                    <b>GIÁM ĐỐC FPT</b> BẠN ĐÃ BỊ ĐUỔI KHỎI TẬP ĐOÀN
                    <small className="text-muted">1 HOURS AGO</small>
                </div>
            </div>
        </div>
    )
}