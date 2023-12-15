import Left from "./left.jsx";
import Middle from "./middle.jsx";
import Right from "./right.jsx";



export default  function Container(){
     return(
          <div className={"container"}>
               <Left/>
                <Middle/>
              {/*<Right/>*/}
          </div>

     )
}