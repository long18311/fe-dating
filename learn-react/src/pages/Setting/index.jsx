import HeaderDefaultLayout from "../../components/defaultlayout/HeaderDefaultLayout.jsx";
import FooterDefaultLayout from "../../components/defaultlayout/FooterDefaultLayout.jsx";
import { useForm, Controller } from "react-hook-form";
import AgeSlider from "./AgeSlider.jsx";
import React, {useEffect, useState} from "react";
import GenderSelector from "./GenderSelector.jsx";
import Distance from "./Distance.jsx";
import axiosClient from "../../apis/AxiosClient.js";
import Slider from "react-slick";
import showErrorAlert from "../SwalAlert/showErrorAlert.jsx";
import {useNavigate} from "react-router-dom";
import logo from  '../../assets/images/welcome/logo-blur.png'
import SearchBar from "../Search/index.jsx";
import Example from "../Examp/Example.jsx";
import {checkToken} from "../../utils/index.js";
import showInfoAlert from "../SwalAlert/showInfoAlert.jsx";
import HwSlider from "./HwSlider.jsx";
import axios from "axios";
import {removeLocationWords} from "../../constants/index.js";


export default function Setting() {
    const host = "https://provinces.open-api.vn/api/";
    const navigate = useNavigate();
    const [id,setId] = useState()
    const [gender,setGender] = useState()
    const [age,setAge] = useState()
    const [location,setLocation] = useState()
    const [height,setHeight] = useState()
    const [weight,setWeight] = useState()
    const [user,setUser] = useState([])
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState('');
    const [districts, setDistricts] = useState([]);
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [wards, setWards] = useState([]);
    const [selectedWard, setSelectedWard] = useState('');
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };
    useEffect(() => {
        // Kiểm tra xem trình duyệt có hỗ trợ Geolocation không
        if (navigator.geolocation) {
            // Nếu hỗ trợ, gọi getCurrentPosition để lấy vị trí hiện tại của người dùng
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    // Nếu thành công, cập nhật biến latitude và longitude
                    axiosClient.get(`https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}
                    &lon=${position.coords.longitude}&format=json`).then((res)=>{
                    }).catch(()=>{})
                    setLatitude(position.coords.latitude);
                    setLongitude(position.coords.longitude);
                },
                (err) => {
                    showInfoAlert("Thông báo","vui lòng bật vị trí để chúng tôi hỗ trợ bạn tốt hơn")
                    console.log(err)
                }
            );
        }
    }, []);

    //dịa chi
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
        fetchDistricts(selectedCityCode);
    };

    const handleDistrictChange = (e) => {
        const selectedDistrictCode = e.target.value;
        setSelectedDistrict(selectedDistrictCode);
        setSelectedWard('');

        fetchWards(selectedDistrictCode);
    };

    const handleWardChange = (e) => {
        const selectedWardName = e.target.value;
        setSelectedWard(selectedWardName);

    };
    //
    const checkLocationEnabledAndSearch = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    return false
                },
                (err) => {
                    // Vị trí chưa được bật, hiển thị thông báo
                    showInfoAlert("Thông báo", "Vui lòng bật vị trí để chúng tôi hỗ trợ bạn tốt hơn");
                    return true
                }
            );
        } else {
            // Trình duyệt không hỗ trợ Geolocation, xử lý tùy bạn
            showInfoAlert("Thông báo", "Trình duyệt không hỗ trợ Geolocation");
            return true
        }
    };
    const settings = {
        infinite: true,
        speed: 400,
        slidesToShow: 1,
        slidesToScroll: 1,
    };
    const sliderRef = React.createRef(); // Tham chiếu đến slider


    const handleAgeChange = (ageValues) => {
        setAge(ageValues)
    };
    const handleDistanceChange = (distance) => {
        setLocation(distance)
    };
    const handleHeightChange = (values) => {
        setHeight(values)
    };
    const handleWeightChange = (values) => {
        setWeight(values)
    };
    const handleGenderChange = (selectedGender) => {
        setGender(selectedGender)
    };


    useEffect(() => {
        axiosClient.get("/userlogged").then((res) => {
            setId(res.id)

        })
    }, []);
    const [informationFields, setInformationFields] = useState([])
    const [selectedInformationOptions, setSelectedInformationOptions] = useState([]); // Trạng thái lưu các sở thích đã chọn
    const [collapsedSections, setCollapsedSections] = useState({})   
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const toggleCollapse = (sectionId) => {
        setCollapsedSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId]
        }));
    };

    const isCollapsed = (sectionId) => {
        return collapsedSections[sectionId];
    };
    const handleInformationOptionChange = (informationOptionId, infoField) => {
        // console.log("vào rồi nè");
        let updatedSelectedInformationOptions;

        if (infoField.multiSelect) {
            // Xử lý khi multiSelect là true
            setSelectedInformationOptions((prevSelected) => {
                if (prevSelected.includes(informationOptionId)) {

                    // Nếu đã được chọn, loại bỏ khỏi danh sách
                    return prevSelected.filter((id) => id !== informationOptionId);
                } else {
                    // Nếu chưa được chọn, thêm vào danh sách
                    return [...prevSelected, informationOptionId];
                }
            });
        } else {
            // Xử lý khi multiSelect là false
            setSelectedInformationOptions((prevSelected) => {


                // Lọc ra các ID của các options trong cùng infoField
                const infoFieldOptionIds = infoField.informationOptions.map((option) => option.id);

                // Nếu đã được chọn, loại bỏ tất cả các option của cùng infoField trước đó
                updatedSelectedInformationOptions = prevSelected.filter((id) => !infoFieldOptionIds.includes(id));

                // Thêm vào danh sách
                updatedSelectedInformationOptions = [...updatedSelectedInformationOptions, informationOptionId];

                return updatedSelectedInformationOptions;
            });
        }
    };
    useEffect(() => {
        if (checkToken()){
            navigate("/loginpage")
        } else {
            axiosClient.get("userProfile/informationFields").then((res)=>{
                setInformationFields(res)
            })
           
        }
    },[]);


    return (
        
        <>
            <HeaderDefaultLayout />
            <div className="flex flex-col lg:flex-row items-center lg:items-start bg-custom-image min-h-screen">

                <div className="w-full lg:w-1/4 px-4 lg:px-0 lg:py-4">

                    <div className={"m-5"}>
                        <i className="fas fa-search "></i>
                        <i className="fas fa-user-friends ml-2"></i>
                        <span className={"ml-2"}>Tìm kiếm nhanh theo tên
                                 <i
                                     className={`ml-2 fas fa-question-circle text-yellow-500 transition transform ${
                                         isHovered ? 'hover:scale-110' : ''
                                     }`}
                                     onMouseEnter={handleMouseEnter}
                                     onMouseLeave={handleMouseLeave}
                                 ></i>
                                  </span>
                        {isHovered && (
                            <div className="tooltip bg-yellow-100 border border-yellow-300 p-4 ">
                                <p className={"text-yellow-600 text-sm/[17px]"}>Nhập chữ cái hoặc tên người dùng để tìm kiếm nhanh,
                                    -Chúng tôi sẽ giúp bạn hiển thị danh sách người dùng phù hợp với thông tin bạn nhập</p>
                            </div>
                        )}

                        <SearchBar/>
                        <AgeSlider  minAge={18} maxAge={100} onChange={handleAgeChange} />
                        <Distance minDistance={0} maxDistance={200} onChange={handleDistanceChange} />
                        <HwSlider  min={140} max={250} type={['Chiều cao','Cm']} onChange={handleHeightChange} />
                        <HwSlider  min={30} max={120} type={['Cân nặng ','KG']} onChange={handleWeightChange} />
                        <div className="border-b border-gray-300 pb-12 mt-3">
                            <div className="mb-4">
                                <select
                                    id="city"
                                    value={selectedCity}
                                    onChange={handleCityChange}
                                    className="w-full p-2 border rounded-md bg-white shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                >
                                    <option value="" disabled>Chọn tỉnh thành</option>
                                    {cities.map((city) => (
                                        <option key={city.code} value={city.code}>{city.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-4">
                                <select
                                    id="district"
                                    value={selectedDistrict}
                                    onChange={handleDistrictChange}
                                    className="w-full p-2 border rounded-md bg-white shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                >
                                    <option value="" disabled>Chọn quận huyện</option>
                                    {districts.map((district) => (
                                        <option key={district.code} value={district.code}>{district.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-4">
                                <select
                                    id="ward"
                                    value={selectedWard}
                                    onChange={handleWardChange}
                                    className="w-full p-2 border rounded-md bg-white shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                >
                                    <option value="" disabled>Chọn phường xã</option>
                                    {wards.map((ward) => (
                                        <option key={ward.code} value={ward.name}>{ward.name}</option>
                                    ))}
                                </select>
                            </div>

                        </div>
                        <div className="flex flex-wrap -mx-2">
                        {
                            [
                                { name: 'hobby', content: 'Sở thích' },
                                { name: 'passion', content: 'Phong cách sống' },
                                { name: 'profession', content: 'Nghề nghiệp' },
                                { name: 'basic_information', content: 'Thông tin cơ bản' }
                            ].map((category) => (
                                <div className="w-1/2 px-2" key={category.name}>
                                    <fieldset>

                                        <div className="mt-3 space-y-2">
                                            {informationFields
                                                .filter((infoField) => infoField.informationType === category.name)
                                                .map((infoField) => (
                                                    <div key={infoField.id} className="mb-4">
                                                        <button
                                                            type="button"
                                                            className=" w-full text-left"
                                                            onClick={() => toggleCollapse(infoField.id)}
                                                        >
                                                            <i className="fas fa-caret-down mr-2 text-2xl"></i>
                                                            {infoField.name}
                                                        </button>
                                                        <div className={`${isCollapsed(infoField.id) ? '' : 'hidden'}`}>
                                                            <p className="text-sm text-gray-600 mb-2">{infoField.decsription}</p>
                                                            <div>
                                                                {infoField.informationOptions.map((infoOption) => (
                                                                    <div key={infoOption.id} className="flex items-center mb-2">
                                                                        <input
                                                                            id={`option-${infoOption.id}`}
                                                                            type='checkbox'
                                                                            name= {`infoField-${infoField.id}`}
                                                                            value={infoOption.id}
                                                                            onChange={() => handleInformationOptionChange(infoOption.id,infoField)}
                                                                            checked={selectedInformationOptions.includes(infoOption.id)}
                                                                            className="mr-2"
                                                                        />
                                                                        <label htmlFor={`option-${infoOption.id}`} className="text-sm leading-6">
                                                                            {infoOption.option}
                                                                        </label>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    </fieldset>
                                </div>
                            ))
                        }
                    </div>
                        <GenderSelector onChange={handleGenderChange} />
                    </div>
                    <button className={"ml-5 mb-2 bg-blue-300 hover:bg-blue-700 text-white py-2 px-4 rounded"} onClick={()=>{
                        if(checkLocationEnabledAndSearch()){
                            return;
                        }
                        let idUserLogged = id;
                        let genderSearch = null;
                        let locationMin = null;
                        let locationMax = null;
                        let ageMin = null;
                        let ageMax = null;
                        let heightMin = null;
                        let heightMax = null;
                        let weightMin = null;
                        let weightMax = null;

                        if(gender===undefined){
                           genderSearch = "Nam"
                        }else{
                            genderSearch = gender
                        }

                        if(location===undefined){
                            locationMin = 0
                            locationMax = 200
                        }
                        else{
                            locationMin=location[0]
                            locationMax=location[1]
                        }
                        if(age===undefined){
                           ageMin = 18
                            ageMax =100
                        }else{
                            ageMin = age[0]
                            ageMax = age[1]
                        }
                        if(height===undefined){
                            heightMin = 140
                            heightMax =250
                        }else{
                            heightMin = height[0];
                            heightMax = height[1];
                        }
                        if(weight===undefined){
                            weightMin = 30
                            weightMax =120
                        }else{
                            weightMin = weight[0]
                            weightMax = weight[1]
                        }

                        const cityText = removeLocationWords(cities.find(city => city.code === parseInt(selectedCity, 10))?.name)||'';
                        const districtText = removeLocationWords(districts.find(district => district.code === parseInt(selectedDistrict, 10))?.name)||'';
                        const wardText = removeLocationWords(selectedWard)||'';

                        console.log(cityText,districtText,wardText)


                        axiosClient.post(`/search/users-by-gender-age-location?id=${idUserLogged}&gender=${genderSearch}
                        &ageMin=${ageMin}&ageMax=${ageMax}&locationMin=${locationMin}&locationMax=${locationMax}&heightMin=${heightMin}&heightMax=${heightMax}&weightMin=${weightMin}&weightMax=${weightMax}&latitude=${latitude}&longitude=${longitude}&city=${cityText}&ward=${wardText}&district=${districtText}`,selectedInformationOptions
                        ).then((res)=>{
                            console.log(res);
                            if (res.length>0){
                                setUser(res)
                            }else{
                                setUser([])
                                showErrorAlert("error","Thông báo","Không tìm thấy bạn yêu cầu !")
                            }

                        }).catch((err)=>{
                            showErrorAlert("error",err,"Không tìm thấy bạn yêu cầu !")
                            console.log(err)})
                    }
                    }>Tìm kiếm</button>

                </div>

                <div className="mx-auto w-full h-auto  object-cover ">
                    {
                        !user && (
                            <div className="flex justify-center items-center min-h-screen">
                                <img className="w-80 h-auto" src={logo} alt="Logo" />
                            </div>
                        )
                    }

                    { user &&
                        <div className="relative min-h-screen ">
                            <div className=" top-0 z-50 bg-white">
                                <h1 className="text-center mt-3 mb-3 ">Những người bạn có thể biết</h1>
                                <Slider {...settings} ref={sliderRef} className="custom-slider px-4">
                                    {user.map((profile, index) => (
                                        <Example key={index} profile={profile}/>
                                    ))}
                                </Slider>
                            </div>
                        </div>

                    }


                </div>
            </div>
            <FooterDefaultLayout />
        </>

    );
}
