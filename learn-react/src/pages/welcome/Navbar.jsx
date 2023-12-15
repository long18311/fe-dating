import "../../styles/welcomeNavbar.css"
import logo from '../../assets/images/welcome/logo.png';

const Navbar = () => {
    const handleClick = (e) => {
        e.preventDefault();
        const target = e.target.getAttribute('href');
        const location = document.querySelector(target).offsetTop;

        window.scrollTo({
            left: 0,
            top: location - 64,
        });
    };
    const links = [
        {
            id: 1,
            text: 'TRANG CHỦ',
            url: '#home',
        },
        {
            id: 2,
            text: 'GIỚI THIỆU',
            url: '#about',
        },
        {
            id: 3,
            text: 'TIÊU CHUẨN CỘNG ĐỒNG',
            url: '#projects',
        },
        {
            id: 4,
            text: 'ĐĂNG NHẬP',
            url: '#contact',
        },
    ]

    return (
        <nav className='navbar sticky top-0 bg-transparent p-4 shadow-amber-50 z-50'>
            <div className='nav-center flex items-center justify-between p-4'>
                <img src={logo} alt='smooth scroll' className='h-20 right-0' />
                <div className='hidden md:flex space-x-4 mr-5'>
                    {links.map((link) => (
                        <a
                            href={link.url}
                            key={link.id}
                            onClick={handleClick}
                            className='text-white hover:text-gray-300 text- font-medium'
                        >
                            {link.text}
                        </a>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
