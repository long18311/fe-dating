import { useState, useEffect } from 'react';
import axiosClient from "../../apis/AxiosClient.js";
import showInfoAlert from "../SwalAlert/showInfoAlert.jsx";


function Location() {
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [address, setAddress] = useState("");
    const [error, setError] = useState(null);


    useEffect(() => {
        // Kiểm tra xem trình duyệt có hỗ trợ Geolocation không
        if (navigator.geolocation) {
            // Nếu hỗ trợ, gọi getCurrentPosition để lấy vị trí hiện tại của người dùng
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    // Nếu thành công, cập nhật biến latitude và longitude
                    axiosClient.get(`https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}
                    &lon=${position.coords.longitude}&format=json`).then((res)=>{
                        setAddress(res.display_name)
                    }).catch(()=>{})
                    setLatitude(position.coords.latitude);
                    setLongitude(position.coords.longitude);
                },
                (err) => {
                    setError(err.message);
                }
            );
        } else {
            setError('Trình duyệt không hỗ trợ Geolocation.');
        }
    }, []);

    return (
        <div>


            {error ? (
                <p>Lỗi: {error}</p>
            ) : (
                <p>
                    Vị trí hiện tại: {latitude}, {longitude} , {address}
                </p>
            )}
        </div>
    );
}

export default Location;
