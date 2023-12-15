import profile17 from "../assets/profile-17.jpg"

export  default function Mess (){
    return(
        <div className="messages">
            <div className="heading">
                <h4>Message</h4><i className="uil uil-edit"></i>
            </div>
            {/*<!-------------SEARCH BAR-------------->*/}
            <div className="search-bar">
                <i className="uil uil-search"></i>
                <input type="search" placeholder="Search messages" id="message-search"/>
            </div>
            {/*<!---------------MESSAGES CATEGORY--------------------->*/}
            <div className="category">
                <h6 className="active">Primary</h6>
                <h6>General</h6>
                <h6 className="message-requests">Requests(7)</h6>
            </div>
            {/*<!------------------- MESSAGE -------------------->*/}

            <div className={"overflow-y-scroll  h-[200px]"}>
            <div className="message ">
                <div className="profile-photo">
                    <img src={profile17}/>
                </div>
                <div className="message-body">
                    <h5>Edem Quist</h5>
                    <p className="text-muted">Just woke up bruh</p>
                </div>
            </div>
                <div className="message ">
                    <div className="profile-photo">
                        <img src={profile17}/>
                    </div>
                    <div className="message-body">
                        <h5>Edem Quist</h5>
                        <p className="text-muted">Just woke up bruh</p>
                    </div>
                </div>
                <div className="message ">
                    <div className="profile-photo">
                        <img src={profile17}/>
                    </div>
                    <div className="message-body">
                        <h5>Edem Quist</h5>
                        <p className="text-muted">Just woke up bruh</p>
                    </div>
                </div>
                <div className="message ">
                    <div className="profile-photo">
                        <img src={profile17}/>
                    </div>
                    <div className="message-body">
                        <h5>Edem Quist</h5>
                        <p className="text-muted">Just woke up bruh</p>
                    </div>
                </div>
                <div className="message ">
                    <div className="profile-photo">
                        <img src={profile17}/>
                    </div>
                    <div className="message-body">
                        <h5>Edem Quist</h5>
                        <p className="text-muted">Just woke up bruh</p>
                    </div>
                </div>
                <div className="message ">
                    <div className="profile-photo">
                        <img src={profile17}/>
                    </div>
                    <div className="message-body">
                        <h5>Edem Quist</h5>
                        <p className="text-muted">Just woke up bruh</p>
                    </div>
                </div>
                <div className="message ">
                    <div className="profile-photo">
                        <img src={profile17}/>
                    </div>
                    <div className="message-body">
                        <h5>Edem Quist</h5>
                        <p className="text-muted">Just woke up bruh</p>
                    </div>
                </div>
            </div>
       
        </div>
    )
}