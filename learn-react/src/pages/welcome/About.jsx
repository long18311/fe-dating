import john from '../../assets/images/welcome/john-doe.png'
import "../../styles/welcomeAbout.css"
const About = () => {
    return (
        <div className='about' id='about'>
            <div className='container'>
                <img width={380} height={380} src={john} alt='john' />
                <div className='col-2'>
                    <h2>Giới thiệu</h2>
                    <span className='line'></span>
                    <p>
                       " Gửi những ai còn độc thân: Nếu bạn đang tìm kiếm người yêu, muốn bắt đầu hẹn hò,
                        hay chỉ đơn giản là muốn có thêm bạn, bạn nên có mặt trên Lovelink.
                        Chân thành mà nói, môi trường hẹn hò ngày nay không còn giống như xưa nữa, giờ đây hầu hết mọi người đang gặp gỡ trực tuyến.
                        Với Lovelink, ứng dụng hẹn hò miễn phí phổ biến nhất trên thế giới, hàng triệu người độc thân tuyệt vời khác luôn nằm trong tầm tay bạn.
                        Không những thế họ luôn sẵn sàng gặp gỡ những người mới như bạn. Dù bạn thẳng hay thuộc cộng đồng LGBTQIA,
                        Lovelink luôn sẵn sàng mang đến cho bạn các cơ hội gặp gỡ."
                    </p>
                    <p>"Tôi là Thiện , người sáng lập của LoveLink , hi vọng các bạn sẽ có trải nghiệm hẹn hò tốt nhất" .</p>
                    <button className='button'>Bắt đầu trải nghiệm</button>
                </div>
            </div>
        </div>
    )
}

export default About
