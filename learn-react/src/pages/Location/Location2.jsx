import { useState, useEffect } from 'react';
import axios from 'axios';

function Location2() {
    const host = "https://provinces.open-api.vn/api/";
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState('');
    const [districts, setDistricts] = useState([]);
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [wards, setWards] = useState([]);
    const [selectedWard, setSelectedWard] = useState('');
    const [result, setResult] = useState('');

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await axios.get(`${host}?depth=1`);
                setCities(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchCities();
    }, []);

    const fetchDistricts = async (cityCode) => {
        try {
            const response = await axios.get(`${host}p/${cityCode}?depth=2`);
            setDistricts(response.data.districts);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchWards = async (districtCode) => {
        try {
            const response = await axios.get(`${host}d/${districtCode}?depth=2`);
            setWards(response.data.wards);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCityChange = (e) => {
        const selectedCityCode = e.target.value;
        setSelectedCity(selectedCityCode);
        setSelectedDistrict('');
        setSelectedWard('');
        setResult('');
        fetchDistricts(selectedCityCode);
    };

    const handleDistrictChange = (e) => {
        const selectedDistrictCode = e.target.value;
        setSelectedDistrict(selectedDistrictCode);
        setSelectedWard('');
        setResult('');
        fetchWards(selectedDistrictCode);
    };

    const handleWardChange = (e) => {
        const selectedWardName = e.target.value;
        setSelectedWard(selectedWardName);
        setResult('');
    };

    const handleCheck = () => {
        const cityText = cities.find(city => city.code === parseInt(selectedCity, 10))?.name;
        const districtText = districts.find(district => district.code === parseInt(selectedDistrict, 10))?.name;
        const wardText = selectedWard;

        if (cityText && districtText && wardText) {
            setResult(`${cityText} | ${districtText} | ${wardText}`);
        }
        console.log(cityText,districtText,wardText)
    };

    return (
        <div>
            <div>
                <select id="city" value={selectedCity} onChange={handleCityChange}>
                    <option value="" disabled>Chọn tỉnh thành</option>
                    {cities.map((city) => (
                        <option key={city.code} value={city.code}>{city.name}</option>
                    ))}
                </select>
            </div>
            <div>
                <select id="district" value={selectedDistrict} onChange={handleDistrictChange}>
                    <option value="" disabled>Chọn quận huyện</option>
                    {districts.map((district) => (
                        <option key={district.code} value={district.code}>{district.name}</option>
                    ))}
                </select>
            </div>
            <div>
                <select id="ward" value={selectedWard} onChange={handleWardChange}>
                    <option value="" disabled>Chọn phường xã</option>
                    {wards.map((ward) => (
                        <option key={ward.code} value={ward.name}>{ward.name}</option>
                    ))}
                </select>
            </div>
            <button onClick={handleCheck}>Kiểm tra</button>

        </div>
    );
}

export default Location2;
