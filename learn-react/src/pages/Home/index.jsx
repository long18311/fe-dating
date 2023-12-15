import Nav from "../nav.jsx";
import Main from "../main.jsx";
import "../../styles/full.css"
import HeaderDefaultLayout from "../../components/defaultlayout/HeaderDefaultLayout.jsx";
export default function Def(){
    return(
        <div className={"bod"}>
           <HeaderDefaultLayout/>
            <Main/>
        </div>
    )
}