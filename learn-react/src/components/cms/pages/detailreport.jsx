// eslint-disable-next-line no-unused-vars
import React, {useEffect, useState} from 'react';
import Post from "../../../pages/post.jsx";
import Feeds from "../../../pages/feeds.jsx";
import {useParams} from "react-router-dom";
import axiosClient from "@/apis/AxiosClient.js";
import Swal from "sweetalert2";
import HeaderDefaultLayout from "../../defaultlayout/HeaderDefaultLayout.jsx";
const ReportDetail = () => {
    const [isImageZoomed, setIsImageZoomed] = useState(false);
    const { reportId } = useParams();

    const [report, setReport] = useState(null);

    useEffect(() => {
        axiosClient.get('/report/' + reportId).then((res) => {
            setReport(res); // Giả sử rằng response trả về là object và được chứa trong `data`
        });
    }, [reportId]); // Thêm reportId vào dependency array để re-fetch khi id thay đổi

    // Xử lý các trường hợp dữ liệu chưa được fetch hoặc fetch không thành công
    if (!report) {
        return <div>Loading...</div>;
    }

    let {
        reportedBy,
        reportedUser,
        reportDate,
        reportContent,
        evidenceImage,
        status,
        adminNotes
    } = report;

    const toggleImageZoom = () => {
        setIsImageZoomed(!isImageZoomed);
    };

    return (

        <div><HeaderDefaultLayout/>
        <div className="p-4 bg-white shadow-lg rounded-lg">
            <div className="flex flex-col md:flex-row md:items-center">
                <div className="flex-1">
                    <h2 className="text-xl font-semibold">Chi tiết Báo cáo</h2>
                    <p><strong>Người báo cáo:</strong> <a onClick={()=>{
                        window.open(`http://localhost:5173/profile/${reportedBy.id}`);
                    }}>{reportedBy.firstname} {reportedBy.lastname}</a></p>
                    <p><strong>Người bị báo cáo:</strong> <a onClick={()=>{
                        window.open(`http://localhost:5173/profile/${reportedUser.id}`);
                    }}>{reportedUser.firstname} {reportedUser.lastname}</a></p>
                    <p><strong>Thời gian báo cáo:</strong> {new Date(reportDate).toLocaleString()}</p>
                    <p><strong>Nội dung:</strong> {reportContent}</p>
                    {evidenceImage && (
                        <div>
                            <img src={evidenceImage} alt="Bằng chứng" className="max-w-xs mt-2 cursor-pointer" onClick={toggleImageZoom} />
                            {isImageZoomed && (
                                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={toggleImageZoom}>
                                    <img src={evidenceImage} alt="Bằng chứng phóng to" className="max-w-full max-h-full p-4" />
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <div className="mt-4 md:mt-0 md:ml-4">
                    <p><strong>Trạng thái báo cáo:</strong> {status}</p>
                    <div className="mt-4 md:mt-0 md:ml-4">
                        <p><strong>Nhận xét của Admin:</strong></p>
                        <textarea className="mt-1 p-2 border rounded w-full" value={adminNotes} onChange={ (event) => {
                            adminNotes = event.target.value}}  />
                        <div className="flex gap-2 mt-4">
                            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={()=>{
                                if(adminNotes == null){
                                    alert("vui lòng điền ghi chú");
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
                                axiosClient.put(`/report/accepted/${reportId}?adminNotes=${adminNotes}`).then((res) => {
                                    Swal.close();
                                    Swal.fire('Thành công!', res, 'success');
                                }).catch((error) => {
                                    Swal.close();
                                    console.log(error)
                                    Swal.fire('Lỗi!', error, 'error');
                                });
                            }}>
                                Khoá tài khoản
                            </button>
                            <button onClick={()=>{
                                if(adminNotes == null){
                                    alert("vui lòng điền ghi chú");
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
                                axiosClient.put(`/report/rejected/${reportId}?adminNotes=${adminNotes}`).then((res) => {
                                    Swal.fire('Thành công!', res, 'success');
                                }).catch((error) => {
                                    Swal.close();
                                    console.log(error)
                                    Swal.fire('Lỗi!', error, 'error');
                                });
                            }} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" >
                                Không khoá tài khoản
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
            </div>
    );
};
export default ReportDetail;
