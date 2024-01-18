import Post from "../../../pages/post.jsx";
import Feeds from "../../../pages/feeds.jsx";
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axiosClient from "@/apis/AxiosClient.js";
import ReactPaginate from "react-paginate";
import HeaderDefaultLayout from "@/components/defaultlayout/HeaderDefaultLayout.jsx";

export default function Cms(){
    const navigate = useNavigate();
    const [reportAccepteds,setReportAccepteds] = useState([]);
    const [status, setStatus] = useState("all");
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [isAdmin, setIsAdmin] = useState(false);


    function containsAdminRole(authorities) {
        return authorities.some(auth => auth.name === "ROLE_ADMIN");
    }


    useEffect(() => {
        axiosClient.get("/userlogged").then(
            (res) => {
                if (!containsAdminRole(res.authorities)) {
                    navigate("/404");
                } else {
                    setIsAdmin(true); // Xác nhận người dùng là admin

                }
            }
        ).catch(
            (err) => {
                console.log(err)
            }
        )
    },[]);

        useEffect(() => {
        axiosClient.get(`/report/giả mạo/${status}?page=${currentPage}&size=10`).then((res) =>{
            setReportAccepteds(res.content);
            setTotalPages(res.totalPages)
        })

    },[]);
    useEffect(() => {
        axiosClient.get(`/report/giả mạo/${status}?page=${currentPage}&size=10`).then((res) =>{
            setReportAccepteds(res.content);
            setTotalPages(res.totalPages);
        })

    },[currentPage,status]);

    return(
        <div>
            <HeaderDefaultLayout/>
            {isAdmin &&
            <section className="container mx-auto p-6 font-mono overflow-y-scroll  h-[700px]">
                <div className="w-full mb-8 overflow-hidden rounded-lg shadow-lg">
                    <div className="w-full overflow-x-auto">
                        <select  value={status} onChange={(e) => {
                            const { name, value } = e.target;
                            setStatus(value);
                        }}>
                            <option value="all">TẤT CẢ TRẠNG THÁI </option>
                            <option value="pending">CHƯA XỬ LÝ</option>
                            <option value="accepted">ĐÃ XỬ LÝ </option>
                            <option value="rejected">ĐÃ TỪ CHỐI XỬ LÝ</option>

                        </select>

                        <table className="w-full ">
                            <thead>
                            <tr className="text-md font-semibold tracking-wide text-left text-gray-900 bg-gray-100 uppercase border-b border-gray-600">
                                <th className="px-4 py-3">Tên người bị báo cáo</th>
                                <th className="px-4 py-3">Loại</th>
                                <th className="px-4 py-3">Trạng thái</th>
                                <th className="px-4 py-3">Thời gian</th>
                                <th className="px-4 py-3">Đính kèm</th>
                                <th className="px-4 py-3">Nội dung báo cáo</th>
                                <th className="px-4 py-3">Admin phản hồi</th>
                                <th className="px-4 py-3"></th>
                            </tr>
                            </thead>
                            <tbody className="bg-white">
                            {
                                reportAccepteds.map((item) => (
                                    <tr key={item.id} className="text-gray-700">
                                        <td className="px-4 py-3 border">
                                            <div className="flex items-center text-sm">
                                                <div className="relative w-8 h-8 mr-3 rounded-full md:block">
                                                    <img className="object-cover w-full h-full rounded-full" src={item.reportedUser.avatar} alt="" loading="lazy" />
                                                    <div className="absolute inset-0 rounded-full shadow-inner" aria-hidden="true"></div>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-black">{item.reportedUser.firstname} {item.reportedUser.lastname}</p>
                                                    <p className="text-xs text-gray-600">Developer</p> {/* This should be dynamic if you have the role in your data */}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-ms font-semibold border">{item.reportType}</td>
                                        <td className="px-4 py-3 text-xs border">
                                            <span className={`px-2 py-1 font-semibold leading-tight rounded-sm ${item.status === 'pending' ? 'text-white bg-yellow-500' : 'text-white bg-green-500'}`}> {item.status.charAt(0).toUpperCase() + item.status.slice(1)} </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm border">{new Date(item.reportDate).toLocaleDateString()}</td>
                                        <td className="px-4 py-3 text-xs border">
                                            <img src={item.evidenceImage} alt="" className="w-16 h-16 object-contain"/>
                                        </td>
                                        <td className="px-4 py-3 text-xs border">
                                            <textarea className="px-5 py-6 " disabled>{item.reportContent}</textarea>
                                        </td>
                                        <td className="px-4 py-3 text-xs border">
                                            <textarea className="px-5 py-6 "disabled>{item.adminNotes}</textarea>
                                        </td>
                                        <td>
                                            <button type="button" onClick={() => {
                                                navigate("/rpdt/"+item.id);
                                            }}
                                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
                                                Xem
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            }

                            </tbody>
                        </table>
                        <div className={"Navigate"}>
                            <ReactPaginate
                                className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                                aria-label="Pagination"
                                previousLabel={"Previous"}
                                nextLabel={"Next"}
                                breakLabel={"..."}
                                pageCount={totalPages}
                                onPageChange={(selectedPage) => {
                                    setCurrentPage(selectedPage.selected);
                                }}
                                //css
                                nextLinkClassName={"pagination__link"}
                                disabledClassName={"pagination__link--disabled"}
                                activeClassName={"pagination__link--active"}
                                pageClassName={"class_page"}
                            />
                        </div>

                    </div>
                </div>
            </section>}
        </div>
    )
}