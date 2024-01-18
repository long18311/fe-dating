
import {useEffect, useState} from "react";
import {checkToken} from "../../utils/index.js";
import axiosClient from "../../apis/AxiosClient.js";
import {useNavigate} from "react-router-dom";
import Swal from 'sweetalert2';
import 'font-awesome/css/font-awesome.min.css';
import HeaderDefaultLayout from "../../components/defaultlayout/HeaderDefaultLayout.jsx";
import FooterDefaultLayout from "../../components/defaultlayout/FooterDefaultLayout.jsx";
//axios này phục vụ cho callapi location
import axios from "axios";
import showInfoAlert from "../SwalAlert/showInfoAlert.jsx";
import showErrorAlert from "../SwalAlert/showErrorAlert.jsx";
import {removeLocationWords} from "../../constants/index.js";
// import ContentVerify from "./ContentVerify.jsx";

export const UpdateProfileUser = () => {

    const host = "https://provinces.open-api.vn/api/";
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState('');
    const [districts, setDistricts] = useState([]);
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [wards, setWards] = useState([]);
    const [selectedWard, setSelectedWard] = useState('');
    const [result, setResult] = useState('');
    const [userLoged,setUserLogged] = useState({ firstname: "" ,images : [] });
    // const [showContent, setShowContent] = useState(false);
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);

    useEffect(()=>{
        if (checkToken()){
            navigate("/loginpage")}},[])

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
    const isImageValid = (file) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = URL.createObjectURL(file);
        });
    }

    const handleAvatarChange = () => {
        // Tạo một input type='file' ẩn
        console.log('handle')
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*'; // Chỉ chấp nhận file ảnh
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) {
                // console.log('Không có file nào được chọn.');
                return;
            }

            // Kiểm tra MIME type của file
            if (file.type.match('image.*')) {
                const isValidImage = await isImageValid(file);
                if (!isValidImage) {
                    showErrorAlert("error", "Lỗi", "File không phải là ảnh hợp lệ.");
                    return;
                }
                // Xử lý file ảnh ở đây
                // console.log(URL.createObjectURL(file));
                Swal.fire({
                    title: "",
                    html: `
                    <div class="flex justify-center items-center h-full">
                    <img className="mx-auto my-auto rounded-full border-2 border-pink-600 p-1"
                    src = "${URL.createObjectURL(file)}"
                    alt="profile"
                    />
                    <div/>
                    `,
                    confirmButtonText: 'sủa avatar',
                    focusConfirm: false,
                    preConfirm: () => {

                        return file;
                    },
                }).then((result) => {
                    if (result.isConfirmed) {
                        const formData = new FormData();
                        formData.append('file', result.value);

                        Swal.fire({
                            title: 'Vui lòng chờ trong giây lát',
                            allowOutsideClick: false,
                            showConfirmButton: false,
                            onBeforeOpen: () => {
                                Swal.showLoading(); // Hiển thị biểu tượng spinner từ Font Awesome
                            },
                            // Thêm một biểu tượng spinner từ Font Awesome
                            html: '<i class="fa fa-spinner fa-spin fa-2x"></i>',
                        });

                        // Thay thế 'your-backend-endpoint' với endpoint thực tế của bạn
                        axiosClient.put(`/userProfile/updateUserAvatar`, formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        }).then((res) => {
                            setUserLogged((prevUserLoged) => ({
                                ...prevUserLoged,
                                avatar: res,
                            }))
                            Swal.close();
                            Swal.fire({
                                icon: "success",
                                title: "thành công",
                                text: 'sủa ảnh thành công'
                            });
                        }).catch((err) => {
                            Swal.fire({
                                icon: "error",
                                title: "Lỗi",
                                text: err.message
                            });
                        });
                    }

                });

            } else {
                console.log('File không phải là ảnh.');
            }
        };

        // Kích hoạt click event
        input.click();
    };
    const handleCoverChange = () => {
        // Tạo một input type='file' ẩn
        console.log('handle')
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*'; // Chỉ chấp nhận file ảnh
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) {
                // console.log('Không có file nào được chọn.');
                return;
            }

            // Kiểm tra MIME type của file
            if (file.type.match('image.*')) {

                const isValidImage = await isImageValid(file);
                if (!isValidImage) {
                    showErrorAlert("error", "Lỗi", "File không phải là ảnh hợp lệ.");
                    return;
                }
                Swal.fire({
                    title: "",
                    html: `
                    <div class="flex justify-center items-center h-full">
                    <img className="mx-auto my-auto rounded-full border-2 border-pink-600 p-1"
                    src = "${URL.createObjectURL(file)}"
                    alt="profile"
                    />
                    <div/>
                    `,
                    confirmButtonText: 'sủa ảnh',
                    focusConfirm: false,
                    preConfirm: () => {

                        return file;
                    },
                }).then((result) => {
                    if (result.isConfirmed) {
                        const formData = new FormData();
                        formData.append('file', result.value);
                        Swal.fire({
                            title: 'Vui lòng chờ trong giây lát',
                            allowOutsideClick: false,
                            showConfirmButton: false,
                            onBeforeOpen: () => {
                                Swal.showLoading(); // Hiển thị biểu tượng spinner từ Font Awesome
                            },
                            // Thêm một biểu tượng spinner từ Font Awesome
                            html: '<i class="fa fa-spinner fa-spin fa-2x"></i>',
                        });

                        // Thay thế 'your-backend-endpoint' với endpoint thực tế của bạn
                        axiosClient.put(`/userProfile/updateUserCover`, formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        }).then((res) => {
                            setUserLogged((prevUserLoged) => ({
                                ...prevUserLoged,
                                cover: res,
                            }))
                            Swal.close();
                            Swal.fire({
                                icon: "success",
                                title: "thành công",
                                text: 'sủa ảnh thành công'
                            });
                        }).catch((err) => {
                            Swal.fire({
                                icon: "error",
                                title: "Lỗi",
                                text: err.message
                            });
                        })


                    }
                });

            } else {
                console.log('File không phải là ảnh.');
            }
        };

        // Kích hoạt click event
        input.click();
    };
    const handleImageChange = () => {
        // Tạo một input type='file' ẩn
        console.log('handle')
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*'; // Chỉ chấp nhận file ảnh
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) {
                // console.log('Không có file nào được chọn.');
                return;
            }

            // Kiểm tra MIME type của file
            if (file.type.match('image.*')) {
                const isValidImage = await isImageValid(file);
                if (!isValidImage) {
                    showErrorAlert("error", "Lỗi", "File không phải là ảnh hợp lệ.");
                    return;
                }
                // Xử lý file ảnh ở đây
                // console.log(URL.createObjectURL(file));
                Swal.fire({
                    title: "",
                    html: `
                    <div class="flex justify-center items-center h-full">
                    <img className="mx-auto my-auto rounded-full border-2 border-pink-600 p-1"
                    src = "${URL.createObjectURL(file)}"
                    alt="profile"
                    />
                    <div/>
                    `,
                    confirmButtonText: 'Thêm ảnh',
                    focusConfirm: false,
                    preConfirm: () => {

                        return file;
                    },
                }).then((result) => {
                    if (result.isConfirmed) {
                        const formData = new FormData();
                        formData.append('file', result.value);

                        Swal.fire({
                            title: 'Vui lòng chờ trong giây lát',
                            allowOutsideClick: false,
                            showConfirmButton: false,
                            onBeforeOpen: () => {
                                Swal.showLoading(); // Hiển thị biểu tượng spinner từ Font Awesome
                            },
                            // Thêm một biểu tượng spinner từ Font Awesome
                            html: '<i class="fa fa-spinner fa-spin fa-2x"></i>',
                        });

                        // Thay thế 'your-backend-endpoint' với endpoint thực tế của bạn
                        axiosClient.post(`/userProfile/createUserImage`, formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        }).then((res) => {
                            setUserLogged((prevUserLoged) => ({
                                ...prevUserLoged,
                                images: res,
                            }));
                            Swal.close();
                            Swal.fire({
                                icon: "success",
                                title: "thành công",
                                text: 'sủa ảnh thành công'
                            });

                        }).catch((err) => {
                            Swal.fire({
                                icon: "error",
                                title: "Lỗi",
                                text: err.message
                            });
                        });


                    }
                });

            } else {
                console.log('File không phải là ảnh.');
            }
        };

        // Kích hoạt click event
        input.click();
    };
    const  navigate = useNavigate()
    const [idProfile, setIdProfile] = useState();
    const [informationFields, setInformationFields] = useState([])
    const [selectedInformationOptions, setSelectedInformationOptions] = useState([]); // Trạng thái lưu các sở thích đã chọn
    const [collapsedSections, setCollapsedSections] = useState({});

    const toggleCollapse = (sectionId) => {
        setCollapsedSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId]
        }));
    };

    const isCollapsed = (sectionId) => {
        return collapsedSections[sectionId];
    };




    // chọn informationOptions
    // const handleInformationOptionChange = (informationOptionId,infoField) => {
    //     console.log("vào rồi nè")
    //     var updatedSelectedInformationOptions;
    //     if(infoField.multiSelect){
    //         if (selectedInformationOptions.includes(informationOptionId)) {
    //             console.log("vào rồi nè 1")
    //             // Nếu sở thích đã được chọn, loại bỏ khỏi danh sách
    //             setSelectedInformationOptions(selectedInformationOptions.filter((id) => id !== informationOptionId));
    //         } else {
    //             console.log("vào rồi nè 2")
    //             // Nếu sở thích chưa được chọn, thêm vào danh sách
    //             setSelectedInformationOptions([...selectedInformationOptions, informationOptionId]);
    //         }
    //     } else {
    //         if (selectedInformationOptions.includes(informationOptionId)) {
    //             // Nếu sở thích đã được chọn, loại bỏ khỏi danh sách
    //             console.log("vào rồi nè 3")
    //             updatedSelectedInformationOptions = infoField.informationOptions.map((informationOption) => {
    //                 console.log(informationOption.id);
    //                 return selectedInformationOptions.filter((id) => id !== informationOption.id|| id !== informationOptionId);
    //             });
    //
    //             setSelectedInformationOptions(updatedSelectedInformationOptions);
    //         } else {
    //             // Nếu sở thích chưa được chọn, thêm vào danh sách
    //             console.log("vào rồi nè 4")
    //
    //             updatedSelectedInformationOptions = infoField.informationOptions.map((informationOption) => {
    //                 console.log(informationOption.id);
    //                 return selectedInformationOptions.filter((id) => id !== informationOption.id|| id !== informationOptionId);
    //             });
    //             setSelectedInformationOptions([...updatedSelectedInformationOptions, informationOptionId]);
    //
    //         }
    //     }
    //
    //
    // };
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
    useEffect(() => {setUserLogged((prevUserLoged) => ({
        ...prevUserLoged,
        informationOptions: selectedInformationOptions.map(selectedID =>({
            id: selectedID,
            informationField: null,
            option: null,
        })),
    }));},[selectedInformationOptions])
    useEffect(() => {
        if (checkToken()){
            navigate("/loginpage")
        } else {
            axiosClient.get("userProfile/informationFields").then((res)=>{
                setInformationFields(res)
            })
            axiosClient.get("userProfile").then((res)=>{
                setUserLogged(res)
                setSelectedInformationOptions(res.informationOptions.map(option => option.id))
                // console.log(res.informationOptions.map(option => option.id))
                setIdProfile(res.id)
            })
        }
    },[]);
    return (
        <>

            <HeaderDefaultLayout/>
            <div className={"p-10"}>

                <form className="space-y-12">
                    <div className="border-b border-gray-900/10 pb-12">

                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6" >
                            {/* Trường nhập họ */}
                            {/*<div className="sm:col-span-3">*/}
                            {/*    <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">*/}
                            {/*        Họ*/}
                            {/*    </label>*/}
                            {/*    <div className="mt-2">*/}
                            {/*        {userLoged && (*/}
                            {/*            <input*/}
                            {/*                className="p-3 block w-1/2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"*/}
                            {/*                onChange={(e) => {*/}
                            {/*                    const { name, value } = e.target;*/}
                            {/*                    setUserLogged((prevUserLoged) => ({*/}
                            {/*                        ...prevUserLoged,*/}
                            {/*                        firstname: value,*/}
                            {/*                    }));*/}
                            {/*                }}*/}
                            {/*                value={userLoged.firstname }*/}
                            {/*            />*/}
                            {/*        )}*/}
                            {/*    </div>*/}
                            {/*    {!userLoged.firstname && (*/}
                            {/*        <p className={"text-red-500"}>Không đc để trống</p>*/}
                            {/*    )}*/}
                            {/*</div>*/}

                            {/*Trường nhập tên*/}
                            {/*<div className="sm:col-span-3"  >*/}
                            {/*    <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">*/}
                            {/*        Tên*/}
                            {/*    </label>*/}
                            {/*    <div className="mt-2">*/}
                            {/*        {userLoged && (*/}
                            {/*            <input*/}
                            {/*                className="p-3 block w-1/2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"*/}
                            {/*                onChange={(e) => {*/}
                            {/*                    const { name, value } = e.target;*/}
                            {/*                    setUserLogged((prevUserLoged) => ({*/}
                            {/*                        ...prevUserLoged,*/}
                            {/*                        lastname: value,*/}
                            {/*                    }));*/}
                            {/*                }}*/}
                            {/*                value={userLoged.lastname }*/}
                            {/*            />*/}
                            {/*        )}*/}
                            {/*    </div>*/}
                            {/*    {!userLoged.lastname && (*/}
                            {/*        <p className={"text-red-500"}>Không đc để trống</p>*/}
                            {/*    )}*/}
                            {/*</div>*/}
                            {/*Trường nhập chiều cao*/}
                            <div className="sm:col-span-3"  >
                                <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                                    chiều cao
                                </label>
                                <div className="mt-2">
                                    {userLoged && (
                                        <input
                                            className="p-3 block w-1/2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            type="number"
                                            min={140}
                                            max={250}
                                            onChange={(e) => {
                                                const { name, value } = e.target;
                                                setUserLogged((prevUserLoged) => ({
                                                    ...prevUserLoged,
                                                    height: value,
                                                }));
                                            }}
                                            value={userLoged.height }
                                        />
                                    )}
                                </div>

                                {(!userLoged.height || userLoged.height < 0) && (
                                    <p className={"text-red-500"}>Không đc để trống</p>
                                )}
                            </div>
                            {/*Trường nhập cân nặng*/}
                            <div className="sm:col-span-3"  >
                                <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                                    cân nặng
                                </label>
                                <div className="mt-2">
                                    {userLoged && (
                                        <input
                                            className="p-3 block w-1/2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            type="number"
                                            min={30}
                                            max={120}
                                            onChange={(e) => {
                                                const { name, value } = e.target;
                                                setUserLogged((prevUserLoged) => ({
                                                    ...prevUserLoged,
                                                    weight: value,
                                                }));
                                            }}
                                            value={userLoged.weight }
                                        />
                                    )}
                                </div>
                                {(!userLoged.weight || userLoged.weight < 0) && (
                                    <p className={"text-red-500"}>Không đc để trống</p>
                                )}
                            </div>

                            {/*Trường nhập biệt danh*/}
                            <div className="sm:col-span-3"  >
                                <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                                    Biệt danh
                                </label>
                                <div className="mt-2">
                                    {userLoged && (
                                        <input
                                            className="p-3 block w-1/2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            onChange={(e) => {
                                                const { name, value } = e.target;
                                                setUserLogged((prevUserLoged) => ({
                                                    ...prevUserLoged,
                                                    nickname: value,
                                                }));
                                            }}
                                            value={userLoged.nickname }
                                        />
                                    )}
                                </div>
                                {!userLoged.nickname && (
                                    <p className={"text-red-500"}>Không đc để trống</p>
                                )}

                            </div>

                            {/*Trường nhập ngày tháng năm sinh*/}
                            {/*<div>*/}
                            {/*    <label>Ngày tháng năm sinh:</label>*/}
                            {/*    <div className="mt-2">*/}
                            {/*        {userLoged && (*/}
                            {/*            <input*/}
                            {/*                type= "date"*/}
                            {/*                onChange={(e) => {*/}
                            {/*                    const { name, value } = e.target;*/}
                            {/*                    setUserLogged((prevUserLoged) => ({*/}
                            {/*                        ...prevUserLoged,*/}
                            {/*                        birthday: value,*/}
                            {/*                    }));*/}
                            {/*                }}*/}
                            {/*                value={userLoged.birthday ? userLoged.birthday.split('T')[0] : '' }*/}
                            {/*            />*/}
                            {/*        )}*/}
                            {/*    </div>*/}
                            {/*    {!userLoged.birthday && (*/}
                            {/*        <p className={"text-red-500"}>Không đc để trống</p>*/}
                            {/*    )}*/}
                            {/*</div>*/}


                            {/* Trường nhập ảnh đại diện (Avatar) */}
                            <div className="col-span-full">
                                <label htmlFor="photo" className="block text-sm font-medium leading-6 text-gray-900">
                                    Avatar
                                </label>

                                <div className="mt-2 flex items-center gap-x-3">
                                    <div className="md:w-3/12 md:ml-16 relative">
                                        {/* Wrapper div with relative positioning */}
                                        <div className="relative w-20 h-20 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-pink-600 p-1">
                                            {/* Image */}
                                            <img
                                                className="absolute top-0 left-0 w-full h-full object-cover rounded-full"
                                                src={userLoged.avatar}
                                                alt="profile"
                                            />
                                            {/* Hover effect for the bottom third */}
                                            <div
                                                onClick={() =>{handleAvatarChange()}}
                                                className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 w-full h-1/3 flex items-center justify-center text-white font-medium text-sm cursor-pointer opacity-0 hover:opacity-100 transition duration-300 ease-in-out">
                                                Sửa avatar
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Trường nhập ảnh bìa (Cover Photo) */}
                            <div className="col-span-full">
                                <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">
                                    Cover photo
                                </label>
                                <div className="relative mt-10">
                                    {/* Wrapper div with relative positioning */}
                                    <div className="relative w-full h-[250px] bg-cover bg-center">
                                        {/* Cover image */}
                                        <img
                                            className="w-full h-full object-cover"
                                            src={userLoged.cover}
                                            alt="cover photo"
                                        />
                                        {/* Hover effect for the bottom third */}
                                        <div
                                            onClick={() =>{handleCoverChange()}}
                                            className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 w-full h-1/3 flex items-center justify-center text-white font-medium text-sm cursor-pointer opacity-0 hover:opacity-100 transition duration-300 ease-in-out">
                                            Sửa ảnh
                                        </div>
                                    </div>
                                </div>
                            </div>


                            {/* Trường nhập ảnh nổi bật (Cover Photo) */}
                            <div className="col-span-full">
                                <label>Ảnh nổi bật:</label>
                                <div className="flex flex-wrap -mx-px md:-mx-3 overflow-y-scroll h-[400px]">
                                    {userLoged.images.map((o, i) => (
                                        <div className="w-1/3 p-px md:px-3" key={i}>
                                            <article className="post relative pb-full md:mb-6">
                                                <img
                                                    className="w-full h-full absolute left-0 top-0 object-cover"
                                                    src={o.url}
                                                    alt="image"
                                                />
                                                <div
                                                    className="cursor-pointer m-2 absolute top-0 right-0 h-8 w-8 bg-red-300 text-white justify-center items-center flex rounded-full"
                                                    onClick={
                                                        async () => {

                                                            Swal.fire({
                                                                title: "Are you sure?",
                                                                text: "You won't be able to revert this!",
                                                                icon: "warning",
                                                                showCancelButton: true,
                                                                confirmButtonColor: "#3085d6",
                                                                cancelButtonColor: "#d33",
                                                                confirmButtonText: "Yes, delete it!"
                                                            }).then((result) => {
                                                                if (result.isConfirmed) {
                                                                    axiosClient.delete(`/userProfile/deleteImageUser/${o.id}`).then((res) => {
                                                                        setUserLogged((prevUserLoged) => ({
                                                                            ...prevUserLoged,
                                                                            images: res,
                                                                        }))
                                                                        Swal.fire({
                                                                            title: "Deleted!",
                                                                            text: "Your file has been deleted.",
                                                                            icon: "success"
                                                                        });
                                                                    }).catch((err) => {
                                                                        Swal.fire({
                                                                            icon: "error",
                                                                            title: "Lỗi",
                                                                            text: err.message
                                                                        });
                                                                    });

                                                                }
                                                            });
                                                        }
                                                    }
                                                >
                                                    X
                                                </div>
                                            </article>
                                        </div>
                                    ))}
                                    <div
                                        onClick={() =>{handleImageChange()}}
                                        className="mt-5 ml-5 w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center cursor-pointer text-white"
                                    >
                                        <i className="fa fa-plus"></i>

                                    </div>

                                </div>
                            </div>

                            {/*Trường chọn trạng thái hôn nhân*/}
                            <div className={"mt-7"}>
                                <select  value={userLoged.maritalstatus || ''} onChange={(e) => {
                                    const { name, value } = e.target;
                                    setUserLogged((prevUserLoged) => ({
                                        ...prevUserLoged,
                                        maritalstatus: value,
                                    }));
                                }}>
                                    <option value="">Chọn trạng thái hôn nhân</option>
                                    <option value="Độc thân">Độc thân</option>
                                    <option value="Đã li dị">Đã li dị</option>
                                    <option value="Đã kết hôn">Đã kết hôn</option>
                                    <option value="Đang hẹn hò">Đang hẹn hò</option>
                                </select>
                                {!userLoged.maritalstatus && (
                                    <p className={"text-red-500"}>Không đc để trống</p>
                                )}
                            </div>

                        </div>

                    </div>

                    {/*sở thích*/}
                    {/* Trường chọn sở thích */}
                    <div className="mt-10 space-y-10">
                        <div className="flex flex-wrap -mx-2">
                            {[ { name: 'basic_information', content: 'Thông tin cơ bản' },
                                { name: 'passion', content: 'Phong cách sống' },
                                { name: 'hobby', content: 'Sở thích'  },
                                { name: 'profession', content: 'Nghề nghiệp' },

                            ].map((category) => (
                                <div className="px-2 mb-4" key={category.name}>
                                    <fieldset>
                                        <legend className=" leading-6 text-gray-900">{category.content}</legend>
                                        <div className="mt-6 space-y-6">
                                            {informationFields
                                                .filter((infoField) => infoField.informationType === category.name)
                                                .map((infoField) => (
                                                    <div key={infoField.id} className="mb-4">

                                                        <button
                                                            type="button"
                                                            className=" w-full  text-left "
                                                            onClick={() => toggleCollapse(infoField.id)}
                                                        >    <i className="fas fa-caret-down mr-2 text-2xl"></i>
                                                            {infoField.name}

                                                        </button>
                                                        <div className={`${isCollapsed(infoField.id) ? 'hidden' : ''}`}>
                                                            <p className="text-sm text-gray-600 mb-2">{infoField.description}</p>
                                                            <div>
                                                                {infoField.informationOptions.map((infoOption) => (
                                                                    <div key={infoOption.id} className="flex items-center mb-2">
                                                                        <input
                                                                            id={`option-${infoOption.id}`}
                                                                            type= 'checkbox'
                                                                            name={`infoField-${infoField.id}`}
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
                            ))}
                            {selectedInformationOptions.length === 0 && (
                                <p className="text-red-500">Chọn ít nhất một lựa chọn 1 thông tin.</p>
                            )}
                        </div>

                        {/* Trường nhập giới tính */}
                        {/*<div>*/}
                        {/*    <label>Giới tính:</label>*/}
                        {/*    <div>*/}
                        {/*        <label>*/}
                        {/*            <input*/}
                        {/*                type="radio"*/}
                        {/*                name="gender" // Đặt cùng tên 'gender' cho các radio buttons cùng nhóm*/}
                        {/*                value="Nam"*/}
                        {/*                checked={userLoged.sex === "Nam"} // Sử dụng 'maritalstatus' thay vì 'sex'*/}
                        {/*                onChange={() => {*/}
                        {/*                    setUserLogged((prevUserLoged) => ({*/}
                        {/*                        ...prevUserLoged,*/}
                        {/*                        sex: 'Nam',*/}
                        {/*                    }));*/}
                        {/*                }}*/}
                        {/*            />{" "}*/}
                        {/*            Nam*/}
                        {/*        </label>*/}
                        {/*        <label className={"ml-3"}>*/}
                        {/*            <input*/}
                        {/*                type="radio"*/}
                        {/*                name="gender" // Đặt cùng tên 'gender' cho các radio buttons cùng nhóm*/}
                        {/*                value="Nữ"*/}
                        {/*                checked={userLoged.sex === "Nữ"} // Sử dụng 'maritalstatus' thay vì 'sex'*/}
                        {/*                onChange={() => {*/}
                        {/*                    setUserLogged((prevUserLoged) => ({*/}
                        {/*                        ...prevUserLoged,*/}
                        {/*                        sex: 'Nữ',*/}
                        {/*                    }));*/}
                        {/*                }}*/}
                        {/*            />{" "}*/}
                        {/*            Nữ*/}
                        {/*        </label>*/}
                        {/*        <label className={"ml-3"}>*/}
                        {/*            <input*/}
                        {/*                type="radio"*/}
                        {/*                name="gender" // Đặt cùng tên 'gender' cho các radio buttons cùng nhóm*/}
                        {/*                value="Khác"*/}
                        {/*                checked={userLoged.sex === "Khác"} // Sử dụng 'maritalstatus' thay vì 'sex'*/}
                        {/*                onChange={() => {*/}
                        {/*                    setUserLogged((prevUserLoged) => ({*/}
                        {/*                        ...prevUserLoged,*/}
                        {/*                        sex: 'Khác',*/}
                        {/*                    }));*/}
                        {/*                }}*/}
                        {/*            />{" "}*/}
                        {/*            Khác*/}
                        {/*        </label>*/}
                        {/*    </div>*/}
                        {/*</div>*/}


                    </div>

                    {/* Trường thêm giới thiệu */}
                    <div className="border-b border-gray-900/10 pb-12">
                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="col-span-full">
                                <label htmlFor="about" className="block text-sm font-medium leading-6 text-gray-900">
                                    About
                                </label>
                                <div className="mt-2">
                                    {userLoged && (
                                        <textarea
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            rows={3}
                                            onChange={(e) => {
                                                const { name, value } = e.target;
                                                setUserLogged((prevUserLoged) => ({
                                                    ...prevUserLoged,
                                                    about: value,
                                                }));
                                            }}
                                            value={userLoged.about } />

                                    )}
                                </div>
                                <p className="mt-3 text-sm leading-6 text-gray-600">Write a few sentences about yourself.</p>
                                {!userLoged.about && (
                                    <p className={"text-red-500"}>Không đc để trống</p>
                                )}

                            </div>


                        </div>

                    </div>

                    {/*<div className="border-b border-gray-300 pb-12">*/}
                    {/*    <div className="text-lg font-semibold mb-4">Lựa chọn quê quán</div>*/}

                    {/*    <div className="mb-4">*/}
                    {/*        <select*/}
                    {/*            id="city"*/}
                    {/*            value={selectedCity}*/}
                    {/*            onChange={handleCityChange}*/}
                    {/*            className="w-full p-2 border rounded-md bg-white shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50"*/}
                    {/*        >*/}
                    {/*            <option value="" disabled>Chọn tỉnh thành</option>*/}
                    {/*            {cities.map((city) => (*/}
                    {/*                <option key={city.code} value={city.code}>{city.name}</option>*/}
                    {/*            ))}*/}
                    {/*        </select>*/}
                    {/*    </div>*/}

                    {/*    <div className="mb-4">*/}
                    {/*        <select*/}
                    {/*            id="district"*/}
                    {/*            value={selectedDistrict}*/}
                    {/*            onChange={handleDistrictChange}*/}
                    {/*            className="w-full p-2 border rounded-md bg-white shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50"*/}
                    {/*        >*/}
                    {/*            <option value="" disabled>Chọn quận huyện</option>*/}
                    {/*            {districts.map((district) => (*/}
                    {/*                <option key={district.code} value={district.code}>{district.name}</option>*/}
                    {/*            ))}*/}
                    {/*        </select>*/}
                    {/*    </div>*/}

                    {/*    <div className="mb-4">*/}
                    {/*        <select*/}
                    {/*            id="ward"*/}
                    {/*            value={selectedWard}*/}
                    {/*            onChange={handleWardChange}*/}
                    {/*            className="w-full p-2 border rounded-md bg-white shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50"*/}
                    {/*        >*/}
                    {/*            <option value="" disabled>Chọn phường xã</option>*/}
                    {/*            {wards.map((ward) => (*/}
                    {/*                <option key={ward.code} value={ward.name}>{ward.name}</option>*/}
                    {/*            ))}*/}
                    {/*        </select>*/}
                    {/*    </div>*/}

                    {/*</div>*/}

                    <div className="mt-6 flex items-center justify-end gap-x-6">
                        <button type="button"  className="text-sm font-semibold leading-6 text-gray-900">
                            Cancel
                        </button>
                        <button type="button" onClick={async () =>{
                            // if (userLoged.city===undefined){
                            //     showInfoAlert("Thông báo","Vui lòng cập nhật quê quán")
                            //     return;
                            // }
                            //

                            setUserLogged((prevUserLoged) => ({
                                ...prevUserLoged,
                                latitude: latitude,
                            }));
                            setUserLogged((prevUserLoged) => ({
                                ...prevUserLoged,
                                longitude: longitude,
                            }));
                            if (userLoged.latitude === null){
                                showInfoAlert("Thông báo","vui lòng bật vị trí để chúng tôi hỗ trợ bạn tốt hơn")
                                return;
                            }
                            const cityText = cities.find(city => city.code === parseInt(selectedCity, 10))?.name;
                            const districtText = districts.find(district => district.code === parseInt(selectedDistrict, 10))?.name;
                            const wardText = selectedWard;
                            //Kiểm tra xem tất cả các trường đều đã được cập nhật
                            if (cityText && districtText && wardText) {
                                // setResult(`${cityText} | ${districtText} | ${wardText}`);
                                setUserLogged(prevUserLoged => ({
                                    ...prevUserLoged,
                                    city: removeLocationWords(cityText),
                                    district: removeLocationWords(districtText),
                                    ward: removeLocationWords(wardText)
                                }));
                            }
                            console.log(selectedInformationOptions)
                            console.log(userLoged.informationOptions)
                            Swal.fire({
                                title: 'Vui lòng chờ trong giây lát',
                                allowOutsideClick: false,
                                showConfirmButton: false,
                                onBeforeOpen: () => {
                                    Swal.showLoading(); // Hiển thị biểu tượng spinner từ Font Awesome
                                },
                                // Thêm một biểu tượng spinner từ Font Awesome
                                html: '<i class="fa fa-spinner fa-spin fa-2x"></i>',
                            });
                            await axiosClient.put('/userProfile/updateUserProfile', userLoged).then(
                                (res)=>{
                                    setUserLogged(res)
                                    Swal.close();
                                    Swal.fire('Thành công!', res, 'success');
                                }
                            ).catch((error) => {
                                Swal.close();
                                console.log(error)
                                Swal.fire('Lỗi!', error, 'error');
                            });
                        }}
                                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Update
                        </button>
                    </div>

                </form>

            </div>
            <FooterDefaultLayout/>
        </>
    );
}