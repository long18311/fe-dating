import HeaderDefaultLayout from "../../components/defaultlayout/HeaderDefaultLayout.jsx";
import FooterDefaultLayout from "../../components/defaultlayout/FooterDefaultLayout.jsx";
import ListProduct from "../Products/ListProducts.jsx";
import {useEffect, useState} from "react";
import axiosClient from "../../apis/AxiosClient.js";


export  default  function HomePage(){

    const  [avt,setAvt] = useState()
    useEffect(() => {

        axiosClient.get("/userlogged").then((res) => {

            setAvt(`${res.avatar}`)

        })
    }, []);

    return (
        <div>
            <HeaderDefaultLayout avt={avt}/>
            <ListProduct/>
            <FooterDefaultLayout/>
        </div>
    )
}