import community from "../../assets/images/welcome/community.png";
import fake from "../../assets/images/welcome/Anony.png";


const Demo = () => {
    return (
        <div className='about' id='about'>
            <div className='container'>
                <div className='col-2'>
                    <h2>Tiêu chuẩn cộng đồng</h2>
                    <span className='line'></span>
                    <p>
                        Tiêu chuẩn cộng đồng của chúng tôi hướng đến mục tiêu tạo ra một nơi để mọi người biểu đạt và bày tỏ ý kiến.
                        Lovelink muốn mọi người được trò chuyện cởi mở về những vấn đề quan trọng với họ, dù là bằng văn bản, ảnh,
                        âm thanh hay các phương tiện nghệ thuật khác, kể cả khi aii đó có thể không đồng ý hoặc phản đố họ. Trong một số trường hợp,
                        chúng tôi vẫn cho phép nội dung vi phạm các tiêu chuẩn của mình, nếu đó là nội dung đáng đưa tin và phục vụ cho lợi ích cộng đồng.
                        Chúng tôi chỉ làm điều này sau khi cân nhắc giữa giá trị lợi ích mang lại cho cộng đồng và nguy cơ gây hại,
                        đồng thời tham khảo các tiêu chuẩn quốc tế về nhân quyền để đưa ra quyết định. Trong các trường hợp khác, chúng tôi có thể gỡ nội dung sử dụng ngôn ngữ
                        khó hiểu hoặc ngụ ý khi ngữ cảnh bổ sung cho phép chúng tôi hiểu rõ một cách hợp lý rằng nội dung đó vi phạm các tiêu chuẩn.
                    </p>
                    <p>"Tôi là Thiện , người sáng lập của LoveLink , hi vọng các bạn sẽ có trải nghiệm hẹn hò tốt nhất" .</p>

                </div>
                <img className={"mt-10"} width={380} height={380} src={community} alt='john' />




            </div>
            <div className='container'>
                <img className={"mt-10"} width={380} height={380} src={fake} alt='john' />
                <div className='col-2'>
                    <h2> Mạo danh , giả mạo </h2>
                    <span className='line'></span>
                    <p>
                        Tài khoản giả mạo là tài khoản mà thông tin đăng ký không phản ánh chính xác hoặc cố ý giả mạo danh tính của một người, nhóm người, hoặc tổ chức.
                        Các tiêu chuẩn cộng đồng được thiết lập để đảm bảo tính minh bạch và xác thực,
                        giúp ngăn chặn các hành vi lừa đảo, xâm phạm quyền riêng tư, và gây mất lòng tin trong cộng đồng.
                        Khi một tài khoản bị nghi ngờ là giả mạo, nền tảng sẽ tiến hành một quy trình xác minh,
                        có thể bao gồm yêu cầu người dùng cung cấp thêm thông tin xác thực hoặc giấy tờ tùy thân.
                        Nếu không thể xác minh được, tài khoản có thể bị tạm thời đình chỉ hoặc khóa vĩnh viễn.
                    </p>
                    <p>"Tôi là Thiện , người sáng lập của LoveLink , hi vọng các bạn sẽ có trải nghiệm hẹn hò tốt nhất" .</p>
                </div>
            </div>
            <div className='container'>
                <div className='col-2'>
                    <h2>Lạm dụng , quấy rối</h2>
                    <span className='line'></span>
                    <p>
                        Xử lý tài khoản quấy rối và lạm dụng trong nhắn tin là một trong những ưu tiên hàng đầu của các nền tảng trực tuyến nhằm bảo
                        đảm an toàn và tạo môi trường tích cực cho người dùng.
                        Đây là một quá trình phức tạp và đa chiều, bao gồm việc phát hiện, xác minh, và áp dụng các biện pháp xử lý cần thiết
                        Phát hiện quấy rối thường dựa vào các báo cáo từ người dùng và công nghệ phân tích hành vi.
                        Các nền tảng cung cấp công cụ cho phép người dùng dễ dàng báo cáo nội dung quấy rối,
                        và đôi khi sử dụng các thuật toán để tự động phát hiện các dấu hiệu lạm dụng hoặc quấy rối.
                        Sau khi nhận được báo cáo, đội ngũ kiểm duyệt nội dung sẽ xác minh và điều tra sự việc. Họ sẽ xem xét nội dung của các tin nhắn, tần suất gửi tin, và bối cảnh của cuộc trò chuyện.
                        Trong quá trình này, việc bảo vệ quyền riêng tư của người dùng là rất quan trọng.
                        Nếu xác định được hành vi quấy rối hoặc lạm dụng, các nền tảng sẽ áp dụng các chính sách đã được đặt ra.
                        Điều này có thể bao gồm việc cảnh báo người dùng vi phạm,
                        hạn chế các chức năng như gửi tin nhắn, hoặc thậm chí là việc đình chỉ hoặc khóa tài khoản vĩnh viễn.
                    </p>
                    <p>"Tôi là Thiện , người sáng lập của LoveLink , hi vọng các bạn sẽ có trải nghiệm hẹn hò tốt nhất" .</p>

                </div>
                <img className={"m-20"} width={380} height={380} src={"https://png.pngtree.com/png-clipart/20230814/original/pngtree-woman-with-stop-harassment-and-abuse-no-sexual-violence-concept-vector-illustration-picture-image_7933836.png"} alt='john' />




            </div>
        </div>
    )
}

export default Demo