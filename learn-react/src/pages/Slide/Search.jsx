import SearchBar from "../Search/index.jsx";

export  default  function SearchUser(){
    return (
        <div className="ml-20 mt-10 min-h-screen">
            <i className="fas fa-search "></i>
            <i className="fas fa-user-friends ml-2"></i>
            <span className={"ml-2"}>Tìm kiếm nhanh</span>
            <SearchBar/>
        </div>
    )
}