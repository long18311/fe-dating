import  {  useState } from 'react';
import {QRCodeCanvas} from 'qrcode.react'

export  default function  PageProduct (){

    const [input, setInput] = useState("");

    const  handleChange = (event)=>{
        setInput(event.target.value)
    }

    return (
        <>
            <div className="QR">Hello QR</div>
        <div>
            <input placeholder={"Input QR"} className={"border-dashed"} onChange={handleChange} type="text"/>
        </div>
        <div className=" flex items-center justify-center h-screen">
            <QRCodeCanvas className={"bg-dark"} value={input}/>
        </div>
        </>
    );
}