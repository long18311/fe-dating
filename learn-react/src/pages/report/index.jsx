import HeaderDefaultLayout from "../../components/defaultlayout/HeaderDefaultLayout.jsx";
import {useState} from "react";
import axiosClient from "../../apis/AxiosClient.js";
import Swal from "sweetalert2";
import {useParams} from "react-router-dom";
import showSuccessAlert from "../SwalAlert/showSuccessAlert.jsx";

export default function Report(){
    // const MAX_SIZE = 2 * 1024 * 1024; // 2MB
    const {userId} = useParams();
    const [file, setFile] = useState(null);
    const [reportType, setReportType] = useState("lạm dụng");
    // const [reportLink, setReportLink] = useState("");
    const [reportContent, setReportContent] = useState("");

    // Xử lý khi có file mới được chọn
    const handleFileChange = (event) => {
        // const selectedFiles = [...event.target.files];
        // const validFiles = selectedFiles.slice(0, MAX_FILES).filter(file => file.size <= MAX_SIZE);
        //
        // if (selectedFiles.some(file => file.size > MAX_SIZE)) {
        //     alert("Mỗi tệp không được vượt quá 2MB!");
        // }
        //
        // if (selectedFiles.length > MAX_FILES) {
        //     alert(`Bạn chỉ có thể tải lên tối đa ${MAX_FILES} tệp.`);
        // }
        //
        // setFiles(validFiles);
        const selectedFile = event.target.files[0];

        // Kiểm tra xem có file nào được chọn không
        if (!selectedFile) {
            alert("Vui lòng chọn một tệp!");
            return; // Không có file nào được chọn
        }

        // Kiểm tra kích thước file
        if (selectedFile.size > 2097152) {
            alert("Tệp không được vượt quá 2MB!");
            return; // Dừng xử lý nếu file quá lớn
        }
        if (!selectedFile.type.match('image.*') && !selectedFile.type.match('video.*')) {
            alert("Tệp không phải là file ảnh hoặc video");
            return; // Dừng xử lý nếu file không phải là ảnh hoặc video
        }
        // Cập nhật file vào state
        setFile(selectedFile);





    };
    return (
        <div>
            <HeaderDefaultLayout/>
            <section className="bg-white dark:bg-gray-900">
                <div className="py-8 lg:py-16 px-4 mx-auto max-w-screen-md">
                    <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-center text-gray-900 dark:text-white">Báo cáo lạm dụng và quấy rối</h2>
                    <p className="mb-8 lg:mb-16 font-light text-center text-gray-500 dark:text-gray-400 sm:text-xl">Chào bạn , bạn đang gặp vấn đề về quấy rối và lạm dụng , hãy cho chúng tôi biết , chúng tôi sẽ giúp bạn bằng cách xác minh và khoá tài khoản người dùng nếu điều đó là sự thật</p>
                    <form action="#" className="space-y-8">
                        <div>
                            <label htmlFor="subject" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Chủ đề</label>
                            <input type="text" id="subject"  defaultValue="Báo cáo lạm dụng và quấy rối"
                                   readOnly className="block p-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light" />
                        </div>
                        {/*<div>*/}
                        {/*    <label htmlFor="subject" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Liên kết tài khoản </label>*/}
                        {/*    <input placeholder="Url profile..." type="text" id="subject" value = {reportLink} onChange={(event) => {*/}
                        {/*        setReportLink(event.target.value);*/}
                        {/*    }}*/}
                        {/*            className="block p-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light" />*/}
                        {/*</div>*/}
                        <div className="sm:col-span-2">
                            <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">Nội dung & tệp đính kèm</label>
                            <textarea id="message" rows="6"
                                      value = {reportContent} onChange={(event) => {
                                setReportContent(event.target.value);
                            }} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Leave a comment..."></textarea>
                        </div>

                        <input
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-violet-50 file:text-violet-700
          hover:file:bg-violet-100
        "
                        />
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {
                                file && (
                                    <div className="w-full p-2 border border-gray-200 rounded-md">
                                        <p className="text-sm truncate">{file.name}</p>
                                    </div>
                                )
                            }
                        </div>

                        <button type="button"
                                onClick={() => {
                                    Swal.close()
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
                                    const formData = new FormData();
                                    formData.append("reportType",reportType)
                                    formData.append("idReport", Number(userId));
                                    formData.append("evidence", file);
                                    formData.append("reportContent", reportContent);
                                    axiosClient.post('/report/send-report', formData, {
                                        headers: {
                                            'Content-Type': 'multipart/form-data',
                                        },
                                    }).then(
                                        (res)=>{
                                            Swal.close()
                                            showSuccessAlert("Báo cáo thành công")
                                        }
                                    ).catch((error) => {
                                        Swal.close();
                                        Swal.fire('Lỗi!', error, 'error');
                                    });
                                }}
                                className="py-3 px-5 text-sm font-medium text-center text-white rounded-lg bg-blue-600 sm:w-fit hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Gửi báo cáo</button>
                    </form>

                </div>
            </section>
        </div>
    )
}