import { useNavigate } from "react-router-dom";
export const TitleMessage = (props) => {

    const { userChat } = props;
    // Use avatar from the new data structure or a default one if it doesn't exist
    const avatar = userChat.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cGVvcGxlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60';

    // Use the full name if available, falling back to the username
    const fullName = `${userChat.firstname || ''} ${userChat.lastname || ''}`.trim() || userChat.username;

    // Check if the user is active based on the 'actived' property (assuming 1 is active and 0 is not)
    // const isActive = userChat.actived === 1;
    const isActive = false;

    const navigate = useNavigate()

    return (
        <div className="conversation-top">
            <button onClick={()=>{ navigate("/message")}} type="button" className="conversation-back"><i className="ri-arrow-left-line"></i></button>
            <div className="conversation-user">
                <img className="conversation-user-image" src={avatar} alt="" />
                <div>
                    <div className="conversation-user-name">{fullName}</div>
                    {/*<div className={`conversation-user-status ${isActive ? 'online' : 'offline'}`}>*/}
                    {/*    {isActive ? 'Hoạt động' : 'Không hoạt động'}*/}
                    {/*</div>*/}
                    {/* Additional information like city can be added here if needed */}
                </div>
            </div>
            <div className="conversation-buttons">
                <button type="button"><i className="ri-phone-fill"></i></button>
                <button type="button"><i className="ri-vidicon-line" onClick={() =>{

                    const windowFeatures = `menubar=no,toolbar=no,status=no,width=${1200},height=${1000},top=${window.top.outerHeight / 2 + window.top.screenY - 500},left=${window.top.outerWidth / 2 + window.top.screenX - 600}`;
                    const newTab = window.open(`http://localhost:5173/meet?userID=${userChat.id}`, '_blank', windowFeatures);
                }}></i></button>
                <button type="button"><i className="ri-information-line"></i></button>
            </div>
        </div>
    )
}