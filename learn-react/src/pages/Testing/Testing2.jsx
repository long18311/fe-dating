import  { useEffect, useState } from 'react';
import axios from 'axios';

function Location2() {
    const [ipAddress, setIpAddress] = useState(''); // State lưu địa chỉ IP
    const [locationInfo, setLocationInfo] = useState({}); // State lưu thông tin vị trí

    useEffect(() => {
        // Hàm gọi API và cập nhật state
        const fetchLocationInfo = async () => {
            try {
                const response = await axios.get(`https://ipinfo.io/${ipAddress}/json`);
                setLocationInfo(response.data);
            } catch (error) {
                console.error('Đã xảy ra lỗi:', error);
            }
        };

        if (ipAddress) {
            fetchLocationInfo();
        }
    }, [ipAddress]);

    return (
        <div>
            <h1>Định vị vị trí từ địa chỉ IP</h1>
            <input
                type="text"
                placeholder="Nhập địa chỉ IP"
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
            />
            <div>
                <h2>Thông tin vị trí:</h2>
                <pre>{JSON.stringify(locationInfo, null, 2)}</pre>
            </div>
        </div>
    );
}

export default Location2;
