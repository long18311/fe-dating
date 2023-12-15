import "../../styles/welcomeHero.css"
import Navbar from "./Navbar.jsx";
import {useNavigate} from "react-router-dom";
const Hero = () => {
    const  navigate = useNavigate();
    return (
        <>
        <div className='hero'>
            <Navbar/>
            <div className='contentHero'>
                <p>Ngày 11/04/2023 ... anhbanthien</p>
                <p></p>
                <p>LOVE LINK</p>
                <p>Hẹn hò ,kết bạn đơn giản ...</p>
                <div  className="container">

                </div>
                <button onClick={() =>{navigate('/loginpage')}
                }  className='button '>TRẢI NGHIỆM NGAY</button>
            </div>
        </div>
        </>
    )
}
export default Hero
