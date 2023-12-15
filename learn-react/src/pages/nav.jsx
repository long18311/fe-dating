import profile from "../assets/profile-1.jpg"

export default function Nav (){
    return(
        <nav className={"fixed"}>
            <div className="container">
                <h2 className="log">
                    bucusucac
                </h2>
                <div className="search-bar">
                    <i className="uil uil-search"></i>
                    <input  type="search"/>
                </div>
                <div className="create">
                    <label className="btn btn-primary">Create</label>
                    <div className="profile-photo">
                        <img src={profile}/>
                    </div>
                </div>
            </div>
        </nav>
    )
}