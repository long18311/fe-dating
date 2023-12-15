
import Story from "./story.jsx";
import Post from "./post.jsx";
import Feeds from "./feeds.jsx";

export  default  function Middle(){
    return(
        <div className={"middle"}>
        <Post/>
        <Feeds/>
        </div>
    )
}