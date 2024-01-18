import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import { useForm, Controller } from "react-hook-form";
import React, {useEffect, useState} from "react";
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
import {formatString, splitFullName} from "../../constants/index.js";
import IdCard from "../../assets/images/Screenshot 2024-01-16 145951.png"

function EditProfileUserNew() {

    const host = "https://provinces.open-api.vn/api/";
    // const [cities, setCities] = useState([]);
    // const [selectedCity, setSelectedCity] = useState('');
    // const [districts, setDistricts] = useState([]);
    // const [selectedDistrict, setSelectedDistrict] = useState('');
    // const [wards, setWards] = useState([]);
    // const [selectedWard, setSelectedWard] = useState('');
    // const [result, setResult] = useState('');
    // const [fileCccd, setFileCccd] = useState(null);
    const [cccd, setCccd] = useState({});
    // const [isVerify, setIsVerify] = useState({});
    const [userLoged,setUserLogged] = useState()
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [isHovered, setIsHovered] = useState(false);
    const [isTooltipVisible, setIsTooltipVisible] = useState(false);

    const handleToggleTooltip = () => {
        setIsTooltipVisible(!isTooltipVisible);
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

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


    // useEffect(() => {
    //     const fetchCities = async () => {
    //         try {
    //             const response = await axios.get(`${host}?depth=1`);
    //             setCities(response.data);
    //         } catch (error) {
    //             console.error(error);
    //         }
    //     };
    //
    //     fetchCities();
    // }, []);
    //
    // const fetchDistricts = async (cityCode) => {
    //     try {
    //         const response = await axios.get(`${host}p/${cityCode}?depth=2`);
    //         setDistricts(response.data.districts);
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };
    //
    // const fetchWards = async (districtCode) => {
    //     try {
    //         const response = await axios.get(`${host}d/${districtCode}?depth=2`);
    //         setWards(response.data.wards);
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };
    //
    // const handleCityChange = (e) => {
    //     const selectedCityCode = e.target.value;
    //     setSelectedCity(selectedCityCode);
    //     setSelectedDistrict('');
    //     setSelectedWard('');
    //     setResult('');
    //     fetchDistricts(selectedCityCode);
    // };
    //
    // const handleDistrictChange = (e) => {
    //     const selectedDistrictCode = e.target.value;
    //     setSelectedDistrict(selectedDistrictCode);
    //     setSelectedWard('');
    //     setResult('');
    //     fetchWards(selectedDistrictCode);
    // };
    //
    // const handleWardChange = (e) => {
    //     const selectedWardName = e.target.value;
    //     setSelectedWard(selectedWardName);
    //     setResult('');
    // };

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm();


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
    const isImageValid = async (file) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = URL.createObjectURL(file);
        });
    }
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

    const onSubmit = async (data) => {
        // const cityText = cities.find(city => city.code === parseInt(selectedCity, 10))?.name;
        // const districtText = districts.find(district => district.code === parseInt(selectedDistrict, 10))?.name;
        // const wardText = selectedWard;
        // if (cityText && districtText && wardText) {
        //     setResult(`${cityText} | ${districtText} | ${wardText}`);
        // }

        const  profile = {...data,informationOptions:selectedInformationOptions,
            // city:cityText,district:districtText,ward:wardText,
            latitude:latitude,longitude:longitude
        }

        // console.log(profile.ward==="")
        // console.log(profile.district===undefined)
        // console.log(profile.city===undefined)
        //
        //
        // if (profile.city===undefined){
        //     showInfoAlert("Thông báo","Vui lòng cập nhật quê quán")
        //     return;
        // }

        if (profile.latitude === null){
            showInfoAlert("Thông báo","vui lòng bật vị trí để chúng tôi hỗ trợ bạn tốt hơn")
            return;
        }

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
        const formData1 = new FormData();
        formData1.append("file[]", profile.face);
        formData1.append("file[]", profile.cccd);

        await axios.post('https://api.fpt.ai/dmp/checkface/v1', formData1, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'api-key': 'U95uyYgr9Df6KCS1uLoH78v3C883mS3C',
            },
        }).then(
            (res)=>{
                if(res.data.data.isMatch) {
                    const formData2 = new FormData();
                    formData2.append("image", profile.cccd);
                    axios.post('https://api.fpt.ai/vision/idr/vnm', formData2, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'api-key': 'U95uyYgr9Df6KCS1uLoH78v3C883mS3C',
                        },
                    }).then(
                        (res)=>{
                            setCccd(res.data.data[0])
                            console.log(res.data.data[0])
                            if(res.data.data === null || res.data.data === undefined){
                                return;
                            }
                            const formData = new FormData();
                            profile.images.forEach((photo) => {
                                formData.append("images", photo);
                            });
                            //Thêm danh sách sở thích vào FormData
                            profile.informationOptions.forEach((informationOptionId) => {
                                formData.append("informationOptions", informationOptionId);
                            });
                            const {firstName,lastName} = splitFullName(cccd.name);
                            formData.append("lastname",lastName)
                            formData.append("firstname",firstName)
                            formData.append("avatar", profile.avatar);
                            formData.append("cover", profile.cover);
                            formData.append("birthdate",cccd.dob)
                            formData.append("sex",formatString(cccd.sex))
                            formData.append("verify",formatString(cccd.id))
                            formData.append("maritalstatus",profile.maritalstatus)
                            formData.append("about",profile.about)
                            formData.append("city",formatString(cccd.address_entities.province))
                            formData.append("ward",formatString(cccd.address_entities.ward))
                            formData.append("district",formatString(cccd.address_entities.district))
                            formData.append("nickname",profile.nickname)
                            formData.append("height",profile.height)
                            formData.append("weight",profile.weight)
                            formData.append("latitude",profile.latitude)
                            formData.append("longitude",profile.longitude)
                            formData.append("id_user",idProfile)




                            axiosClient.post('/userProfile/register-profile', formData, {
                                headers: {
                                    'Content-Type': 'multipart/form-data',
                                },
                            }).then(
                                (res)=>{
                                    Swal.close();
                                    Swal.fire('Thành công!', res, 'success');
                                }
                            ).catch((error) => {
                                Swal.close();
                                Swal.fire('Lỗi!', error, 'error');
                            });

                            // Lưu giá trị tệp hình ảnh đã chọn vào field
                            // field.onChange(e.target.files[0]);
                        }
                    ).catch((error) => {
                        Swal.close();
                        // Lưu giá trị tệp hình ảnh đã chọn vào field
                        // e.target.files[0] = undefined;
                        // field.onChange(null);
                        console.log(error)
                        Swal.fire('Lỗi!', error, 'error');
                    });
                } else {
                    Swal.close();
                    console.log()
                    Swal.fire('Lỗi!', 'không trùng khuân mặt', 'error');
                }
            }
        ).catch((error) => {
            Swal.close();
            // Lưu giá trị tệp hình ảnh đã chọn vào field
            // e.target.files[0] = undefined;
            // field.onChange(null);
            console.log(error)
            Swal.fire('Lỗi!', error, 'error');
        });
        console.log(profile)

        //GỬI SANG CHO BACKEND

        console.log('đc rồi nè')

    };

    useEffect(() => {
        if (checkToken()){
            navigate("/loginpage")
        } else {
            axiosClient.get("userProfile/informationFields").then((res)=>{
                setInformationFields(res)
            })
            axiosClient.get("userlogged").then((res)=>{
                console.log(res)
                setIdProfile(res.id)
            })
        }
    },[]);
    useEffect(()=>{
        axiosClient.get("/userlogged").then((res)=>{
            //set kết quả trả về từ api cho userloged , bây giờ các thẻ trường nhận dữ liệu sẽ nhận kết quả từ api
            setUserLogged(res)
            console.log(userLoged.avatar)
        }).catch(()=>{})
    },[])

    return (
        <>

           <HeaderDefaultLayout/>
        <div className={"p-10"}>

            <form className="space-y-12" onSubmit={handleSubmit(onSubmit)}>
                <div className="border-b border-gray-900/10 pb-12">

                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6" >
                {/* Trường nhập họ */}
                {/*<div className="sm:col-span-3">*/}
                {/*    <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">*/}
                {/*        Họ*/}
                {/*    </label>*/}
                {/*     <div className="mt-2">*/}
                {/*         {userLoged && (*/}
                {/*             <Controller*/}
                {/*                 name="firstname"*/}
                {/*                 control={control}*/}
                {/*                 rules={{ required: "Họ không được để trống" }}*/}
                {/*                 render={({ field }) => (*/}
                {/*                     <input*/}
                {/*                         className="p-3 block w-1/2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"*/}
                {/*                         {...field}*/}
                {/*                         value={field.value || ''}*/}
                {/*                     />*/}
                {/*                 )}*/}
                {/*             />*/}
                {/*         )}*/}
                {/*     </div>*/}
                {/*    {errors.firstname && <p className={"mt-5"}>{errors.firstname.message}</p>}*/}
                {/*</div>*/}

                {/*/!*Trường nhập tên*!/*/}
                {/*<div className="sm:col-span-3"  >*/}
                {/*    <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">*/}
                {/*        Tên*/}
                {/*    </label>*/}
                {/*    <div className="mt-2">*/}
                {/*        {userLoged && (  <Controller*/}
                {/*            name="lastname"*/}
                {/*            control={control}*/}
                {/*            rules={{ required: "Tên không được để trống" }}*/}
                {/*            render={({ field }) => <input*/}
                {/*                autoComplete="family-name"*/}
                {/*                className=" p-3 block w-1/2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"*/}
                {/*                {...field} value={field.value || ''} />} // Khởi tạo giá trị ban đầu*/}
                {/*        />)}*/}
                {/*    </div>*/}
                {/*    {errors.lastname && <p className={"mt-5"}>{errors.lastname.message}</p>}*/}
                {/*</div>*/}
                    {/* Trường nhập chiều cao */}
                    <div className="sm:col-span-3">
                        <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                            Chiều cao (cm)
                        </label>
                        <div className="mt-2">
                            {userLoged && (
                                <Controller
                                    name="height"
                                    control={control}
                                    rules={{ required: "chiều cao không được để trống" }}
                                    render={({ field }) => (
                                        <input
                                            className="p-3 block w-1/2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            type="number"
                                            min={140}
                                            max={250}
                                            {...field}
                                            value={field.value || ''}
                                        />
                                    )}
                                />
                            )}
                        </div>
                        {errors.height && <p className={"mt-5"}>{errors.height.message}</p>}
                    </div>

                    {/*Trường nhập chân năng*/}
                    <div className="sm:col-span-3"  >
                        <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                            Cân nặng (kg)
                        </label>
                        <div className="mt-2">
                            {userLoged && (  <Controller
                                name="weight"
                                control={control}
                                rules={{ required: "cân nặng không được để trống" }}
                                render={({ field }) => <input
                                    autoComplete="family-name"
                                    className=" p-3 block w-1/2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    type="number"
                                    min={30}
                                    max={120}
                                    {...field} value={field.value || ''} />} // Khởi tạo giá trị ban đầu
                            />)}
                        </div>
                        {errors.weight && <p className={"mt-5"}>{errors.weight.message}</p>}
                    </div>

                    {/*Trường nhập biệt danh*/}
                    <div className="sm:col-span-3"  >
                        <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                            Biệt danh
                        </label>
                        <div className="mt-2">
                            {userLoged && (  <Controller
                                name="nickname"
                                control={control}
                                rules={{ required: "Biệt danh không được để trống" }}
                                render={({ field }) => <input
                                    autoComplete="family-name"
                                    className=" p-3 block w-1/2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    {...field} value={field.value || ''} />} // Khởi tạo giá trị ban đầu
                            />)}
                        </div>
                        {errors.nickname && <p className={"mt-5"}>{errors.lastname.message}</p>}
                    </div>

                {/*Trường nhập ngày tháng năm sinh*/}
                {/*<div>*/}
                {/*    <label>Ngày tháng năm sinh:</label>*/}
                {/*    {userLoged && (<Controller*/}
                {/*        name="birthdate"*/}
                {/*        control={control}*/}
                {/*        rules={{ required: "Ngày tháng năm sinh không được để trống" }}*/}
                {/*        render={({ field }) => <input type="date" {...field} value={field.value ||  ""}  />}*/}
                {/*    />)}*/}
                {/*    {errors.birthdate && <p>{errors.birthdate.message}</p>}*/}
                {/*</div>*/}

                {/* Trường nhập ảnh đại diện (Avatar) */}
                <div className="col-span-full">
                    <label htmlFor="photo" className="block text-sm font-medium leading-6 text-gray-900">
                        Avatar
                    </label>

                      <div className="mt-2 flex items-center gap-x-3">
                          <UserCircleIcon className="h-12 w-12 text-gray-300" aria-hidden="true" />
                          <Controller
                              name="avatar" // Tên của trường (đảm bảo trùng với tên trong data)
                              control={control}
                              rules={{ required: "Vui lòng chọn ảnh đại diện" }} // Quy tắc kiểm tra bắt buộc
                              render={({ field }) => (
                                  <input
                                      className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                      type="file"
                                      onChange={async (e) => {
                                          const isValidImage = await isImageValid(e.target.files[0]);
                                          if (!isValidImage) {
                                              showErrorAlert("error", "Lỗi", "File không phải là ảnh hợp lệ.");
                                              return;
                                          }
                                          // Lưu giá trị tệp hình ảnh đã chọn vào field
                                          field.onChange(e.target.files[0]);
                                      }}
                                  />
                              )}
                          />
                      </div>


                    {errors.avatar && <p>{errors.avatar.message}</p>}
                </div>


                {/* Trường nhập ảnh bìa (Cover Photo) */}
                <div className="col-span-full">
                    <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">
                        Cover photo
                    </label>
                    <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">

                        <div className="text-center">
                            <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />

                            <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                <Controller
                                    className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                    name="cover" // Tên của trường (đảm bảo trùng với tên trong data)
                                    control={control}
                                    rules={{ required: "Vui lòng chọn ảnh bìa" }} // Quy tắc kiểm tra bắt buộc
                                    render={({ field }) => (
                                        <input
                                            className="appearance-none border border-gray-300 rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:ring focus:border-indigo-600"
                                            type="file"
                                            onChange={async (e) => {
                                                // Lưu giá trị tệp hình ảnh đã chọn vào field
                                                const isValidImage = await isImageValid(e.target.files[0]);
                                                if (!isValidImage) {
                                                    showErrorAlert("error", "Lỗi", "File không phải là ảnh hợp lệ.");
                                                    return;
                                                }
                                                field.onChange(e.target.files[0]);
                                            }}
                                        />
                                    )}
                                />
                            </div>

                        </div>

                    </div>
                    {errors.cover && <p>{errors.cover.message}</p>}
                </div>

                {/* Trường nhập ảnh nổi bật (Cover Photo) */}
                <div>
                    <label>Ảnh nổi bật:</label>
                    <Controller
                        name="images" // Tên của trường (đảm bảo trùng với tên trong data)
                        control={control}
                        rules={{ required: "Vui lòng chọn ảnh nổi bật" }}
                        render={({ field }) => (
                            <input
                                type="file"
                                multiple // Cho phép chọn nhiều tệp
                                onChange={async (e) => {
                                    const isValidImage = await isImageValid(e.target.files[0]);
                                    if (!isValidImage) {
                                        showErrorAlert("error", "Lỗi", "File không phải là ảnh hợp lệ.");
                                        return;
                                    }
                                    // Lưu giá trị của tất cả các tệp hình ảnh đã chọn vào field
                                    field.onChange([...e.target.files]);
                                }}
                            />
                        )}
                    />
                    {errors.images && <p>{errors.images.message}</p>}
                </div>

                </div>
                    {/*Trường chọn trạng thái hôn nhân*/}
                    <div className={"mt-7"}>
                        <Controller
                            name="maritalstatus"
                            control={control}
                            rules={{ required: "Vui lòng chọn trạng thái hôn nhân" }}
                            render={({ field }) => (
                                <select {...field} value={field.value || ''}>
                                    <option value="">Chọn trạng thái hôn nhân</option>
                                    <option value="Độc thân">Độc thân</option>
                                    <option value="Đã li dị">Đã li dị</option>
                                    <option value="Đã kết hôn">Đã kết hôn</option>
                                    <option value="Đang hẹn hò">Đang hẹn hò</option>
                                </select>
                            )}
                        />
                        {errors.maritalstatus && <p className={""}>{errors.maritalstatus.message}</p>}
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
                    {/*    <Controller*/}
                    {/*        name="sex"*/}
                    {/*        control={control}*/}
                    {/*        defaultValue=""*/}
                    {/*        rules={{ required: true }}*/}
                    {/*        render={({ field }) => (*/}
                    {/*            <div>*/}
                    {/*                <label>*/}
                    {/*                    <input*/}
                    {/*                        type="radio"*/}
                    {/*                        {...field}*/}
                    {/*                        value="Nam"*/}
                    {/*                    />{" "}*/}
                    {/*                    Nam*/}
                    {/*                </label>*/}
                    {/*                <label className={"ml-3"}>*/}
                    {/*                    <input*/}
                    {/*                        type="radio"*/}
                    {/*                        {...field}*/}
                    {/*                        value="Nữ"*/}
                    {/*                    />{" "}*/}
                    {/*                    Nữ*/}
                    {/*                </label>*/}
                    {/*                <label className={"ml-3"}>*/}
                    {/*                    <input*/}
                    {/*                        type="radio"*/}
                    {/*                        {...field}*/}
                    {/*                        value="Khác"*/}
                    {/*                    />{" "}*/}
                    {/*                    Khác*/}
                    {/*                </label>*/}
                    {/*            </div>*/}
                    {/*        )}*/}
                    {/*    />*/}
                    {/*    {errors.sex && <p>Giới tính là trường bắt buộc.</p>}*/}
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
                                <Controller
                                    name="about"
                                    control={control}
                                    rules={{ required: "Giới thiệu không được để trống" }}
                                    render={({ field }) => <textarea
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        rows={3}
                                        {...field} value={field.value || ''} />}
                                />
                            </div>
                            <p className="mt-3 text-sm leading-6 text-gray-600">Write a few sentences about yourself.</p>
                        </div>
                        {errors.about && <p>{errors.about.message}</p>}
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

                <i
                    className={`ml-2 fas fa-question-circle text-yellow-500 transition transform ${
                        isHovered ? 'hover:scale-110' : ''
                    }`}
                    onClick={handleToggleTooltip}
                ></i>

                <span className={"ml-2"}>Xác thực người dùng & điều khoản sử dụng.</span>
                {isTooltipVisible  && (
                    <div className="tooltip bg-yellow-100 border border-yellow-300 p-4 ">
                        <p className={"text-gray-600 text-sm/[17px]"}>

                            <p className={"font-bold text-black"}>
                                <i className="fas fa-chart-pie mr-2 text-blue-400"></i>

                                TỔNG QUAN</p>
                            <p> -Chúng tôi sử dụng (xác thực khuôn mặt) cung cấp những thuật toán học sâu (deep learning) tối ưu nhất cho việc so sánh hình chụp chân dung trên các giấy tờ tùy thân như CMND/CCCD, bằng lái xe, hộ chiếu…
                                với ảnh chụp khuôn mặt nhằm xác thực liệu người đó có phải chủ nhân của các giấy tờ trên.
                            </p>
                            <p>
                            Chúng tôi sẽ lấy các thông tin cơ bản bao gồm , hộ tên , giới tính , ngày sinh và quê quán của bạn
                                để thiết lập thông tin cá nhân cho tài khoản của bạn.
                            </p>
                            <p className={"font-bold text-black"}>
                                <i className="fas fa-bullseye mr-2 text-green-500"></i>

                                MỤC ĐÍCH</p>
                            -Chúng tôi yêu cầu người dùng cung cấp giấy tờ tùy thân và ảnh chân dùng nhằm mục đích xác thực người dùng
                            và tạo nên một môi trường an toàn trên ứng dụng hẹn hò.
                            -Nhận dạng khuôn mặt trong ảnh và xác thực liệu các ảnh đó có là cùng một người hay không.

                           <p className={"font-bold text-black"}>
                               <i className="fas fa-exclamation-triangle text-yellow-500 mr-2"></i>
                               QUY ĐỊNH </p>

                            Phải là ảnh có định dạng jpg hoặc jpeg
                            Ảnh đầu vào không vượt quá 5 MB và độ phân giải tối thiểu khoảng 640x480 để đảm bảo tỉ lệ đọc chính xác
                            Tỉ lệ diện tích khuôn mặt phải chiếm tối thiểu ¼ tổng diện tích ảnh.

                            <img className={"mb-2 rounded-xl justify-center"} src={IdCard} alt="Image" />

                            <p className={"font-bold text-black"}>
                                <i className="fas fa-exclamation-triangle text-red-500 mr-2"></i>
                                CẢNH BÁO
                            </p>
                             <p> Việc bạn cố tình sử dụng giấy tờ tùy thân giả sẽ ảnh hưởng trực tiếp đến cá nhân của bạn.
                                 Theo Điều 341, người làm giả CCCD, CMND hoặc sử dụng CCCD, CMND giả để thực hiện hành vi trái pháp luật có thể bị phạt tiền từ 30 - 100 triệu đồng,
                                 phạt cải tạo không giam giữ đến 03 năm hoặc phạt tù từ 06 tháng đến 02 năm ...</p>
                            <p className={"font-bold text-black"}>
                               Xem chi tiết tại
                            </p>
                            <a className={"text-red-500"} href={"https://lsvn.vn/lam-gia-cccd-tren-mang-xa-hoi-coi-chung-phat-nang-1695785773.html"}>https://lsvn.vn/lam-gia-cccd-tren-mang-xa-hoi-coi-chung-phat-nang-1695785773.html</a>
                        </p>
                    </div>
                )}





                {/* Trường nhập ảnh Căn cước công dân (Cccd) */}
                <div className="sm:col-span-3">
                    <label htmlFor="photo" className="block text-sm font-medium leading-6 text-gray-900">
                        Giấy tờ tùy thân
                    </label>
                    <div className="mt-2 flex items-center gap-x-3">
                        <UserCircleIcon className="h-12 w-12 text-gray-300" aria-hidden="true" />
                        <Controller
                            name="cccd" // Tên của trường (đảm bảo trùng với tên trong data)
                            control={control}
                            rules={{ required: "Vui lòng chọn ảnh " }} // Quy tắc kiểm tra bắt buộc
                            render={({ field }) => (
                                <input
                                    className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                    type="file"
                                    onChange={async (e) => {
                                        const isValidImage = await isImageValid(e.target.files[0]);
                                        if (!isValidImage) {
                                            showErrorAlert("error", "Lỗi", "File không phải là ảnh hợp lệ.");
                                            return;
                                        }

                                        // Lưu giá trị tệp hình ảnh đã chọn vào field
                                        field.onChange(e.target.files[0]);

                                    }}
                                />
                            )}
                        />
                    </div>
                    {errors.cccd && <p>{errors.cccd.message}</p>}
                </div>
                {/* Trường nhập ảnh ảnh khuân măt (Avatar) */}
                <div className="sm:col-span-3">
                    <label htmlFor="photo" className="block text-sm font-medium leading-6 text-gray-900">
                        Ảnh chân dung
                    </label>

                    <div className="mt-2 flex items-center gap-x-3">
                        <UserCircleIcon className="h-12 w-12 text-gray-300" aria-hidden="true" />
                        <Controller
                            name="face" // Tên của trường (đảm bảo trùng với tên trong data)
                            control={control}
                            rules={{ required: "Vui lòng chọn ảnh " }} // Quy tắc kiểm tra bắt buộc
                            render={({ field }) => (
                                <input
                                    className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                    type="file"
                                    onChange={async (e) => {
                                        const isValidImage = await isImageValid(e.target.files[0]);
                                        if (!isValidImage) {
                                            showErrorAlert("error", "Lỗi", "File không phải là ảnh hợp lệ.");
                                            return;
                                        }

                                        // Lưu giá trị tệp hình ảnh đã chọn vào field
                                        field.onChange(e.target.files[0]);

                                    }}
                                />
                            )}
                        />
                    </div>
                    {errors.face && <p className={"text-red-500"}>{errors.face.message}</p>}
                </div>

                <div className="mt-6 flex items-center justify-end gap-x-6">
                    <button type="button"
                            onClick={()=>{

                            }}
                            className="text-sm font-semibold leading-6 text-gray-900">
                        Verify
                    </button>
                    <button type="submit"
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Save
                    </button>
                </div>

            </form>

        </div>
            <FooterDefaultLayout/>
        </>
    );
}

export default EditProfileUserNew;
