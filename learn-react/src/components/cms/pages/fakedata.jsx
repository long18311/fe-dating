import ReportDetail from "./detailreport.jsx";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axiosClient from "@/apis/AxiosClient.js";

export default function Fakedata(){

    const fakeReport = {
        reporterName: "Nguyễn Văn A",
        reportedName: "Trần Thị B",
        reportTime: "2023-12-06T09:00:00Z",
        reportContent: "Nội dung báo cáo ví dụ: Vi phạm nguyên tắc cộng đồng.",
        evidenceImage: "https://csgt.com.vn/wp-content/uploads/2022/07/Hinh-CMND-bi-mo-thi-co-duoc-dang-ky-thi-bang-lai-khong.jpg",
        adminComment: "Đang xem xét",
        onLockAccount: () => alert("Khoá tài khoản"),
        onUnlockAccount: () => alert("Không khoá tài khoản"),
    };

    return (
        <div className="App">
            <ReportDetail report={fakeReport} />
        </div>
    );
}