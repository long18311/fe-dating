import { useForm } from 'react-hook-form';
import HeaderDefaultLayout from "../../components/defaultlayout/HeaderDefaultLayout.jsx";
import {Button} from "@mui/material";
import {useEffect, useState} from "react";
import {checkToken} from "../../utils/index.js";
import {useNavigate} from "react-router-dom";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import axiosClient from "../../apis/AxiosClient.js";
import FooterDefaultLayout from "../../components/defaultlayout/FooterDefaultLayout.jsx";

export  default  function CreatePage() {

    const { register, handleSubmit, formState: { errors } } = useForm();
    const [selectedValue, setSelectedValue] = useState('1');
    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };
    // upload file
    const  onSubmit =  (data)=>{
        const newData = {...data,status:selectedValue}
        const formData = new FormData();
        formData.append('name', newData.name);
        formData.append('status', newData.status);
        for (const file of newData.avatar) {
            formData.append('avatar', file);
        }
             axiosClient
                 .post('/admin/create-product', formData, {
                     headers: {
                         'Content-Type': 'multipart/form-data',
                     },
                 }).then(
                 (res)=>{
                      alert("Success")
                     console.log(res)}
             ).catch(
                 (err)=>{
                     alert("Error")
                     console.log(err)}
             )
    }
    const  navigate = useNavigate()
// check roles
    useEffect(() => {
        if (checkToken()){
            navigate("/loginpage")
        }
        axiosClient
            .get('/userlogged' ).then(
            (res)=>{
                res.authorities.map((item)=>{
                    console.log(item.name)
                   if (item.name!=="ROLE_ADMIN"){
                       navigate("/homepage")
                   }
                })
            }
        ).catch(
            (err)=>{
                console.log(err)}
        )
    }, []);

    return (
        <>
            <HeaderDefaultLayout/>
            <form className={"m-10"} onSubmit={handleSubmit(onSubmit)}>
                <div className="md:w-1/3">
                    <FormLabel id="demo-row-radio-buttons-group-label">Name</FormLabel>
                </div>
                <div className={"md:w-2/3"}>
                    <input className={"bg-gray-200 appearance-none border-2 border-gray-200 " +
                        "rounded w-2/3 py-2 px-4 text-gray-700" +
                        " leading-tight focus:outline-none focus:bg-white focus:border-purple-500 " +
                        "id='inline-full-name' type='text'"}
                        type="text"
                        id="name"
                        placeholder={"inputname"}
                        {...register('name', { required: 'Tên không được bỏ trống',
                            minLength: {
                                value: 3,
                                message: 'Tên phải dài hơn 3 ký tự', // Tùy chỉnh thông báo lỗi khi tên quá ngắn
                            },
                            maxLength: {
                                value: 15,
                                message: 'Tên phải ngắn hơn 20 ký tự', // Tùy chỉnh thông báo lỗi khi tên quá dài
                            }
                        })}
                    />
                    {errors.name &&
                        <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4" role="alert">
                            <p className="font-bold">Be Warned</p>
                            <p>{errors.name.message}</p>
                        </div>
                    }
                </div>
                <FormLabel id="demo-row-radio-buttons-group-label">Status</FormLabel>
                <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    value={selectedValue}
                    onChange={handleChange}
                >
                    <FormControlLabel  value="1" control={<Radio />} label="On" />
                    <FormControlLabel  value="0" control={<Radio />} label="Off" />
                </RadioGroup>
                <div>
                    <label htmlFor="avatar">Avatar</label>
                    <input
                        multiple
                        type="file"
                        id="avatar"
                        {...register('avatar', { required: 'Vui lòng chọn ảnh avatar' })}
                    />
                    {errors.avatar && <span>{errors.avatar.message}</span>}
                </div>

                <Button variant="contained" type="submit">Tạo mới sản phẩm</Button>
            </form>
            <FooterDefaultLayout/>
        </>
    )
}