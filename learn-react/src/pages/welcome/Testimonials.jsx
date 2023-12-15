import React from 'react'
import user1 from '../../assets/images/welcome/user1.jpeg'
import user2 from '../../assets/images/welcome/user2.jpeg'
import user3 from '../../assets/images/welcome/user3.jpeg'

const Testimonials = () => {
    return (
        <div className='testimonials w-full bg-gray-50 py-16' id='testimonials'>
            <div className='container mx-auto px-4'>
                <h2 className='text-3xl text-center font-semibold mb-6'>Khách Hàng Nói Gì</h2>
                <div className='w-full h-1 bg-green-500 mb-12'></div>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>

                    <div className='card border border-gray-200 rounded-lg overflow-hidden shadow-md'>
                        <div className='p-4 bg-white'>
                            <img className='rounded-full w-24 h-24 mx-auto border-4 border-white transform -translate-y-1/2' src={'đường_dẫn_ảnh_của_bạn'} alt='Phản hồi của khách hàng'/>
                        </div>
                        <div className='p-4'>
                            <p className='text-gray-600 text-lg mb-4'>Không phải ngày nào bạn cũng gặp một nhà tư vấn tài chính đầy đam mê và đáng tin cậy. John Doe là một chuyên gia thực thụ và làm việc của mình rất tốt. Cảm ơn John!</p>
                            <p className='text-primary-color text-base font-bold'>Johnson.M.J.</p>
                            <p className='text-sm'>Giám đốc "Financial Times"</p>
                        </div>
                    </div>
                    <div className='card border border-gray-200 rounded-lg overflow-hidden shadow-md'>
                        <div className='p-4 bg-white'>
                            <img className='rounded-full w-24 h-24 mx-auto border-4 border-white transform -translate-y-1/2' src={'đường_dẫn_ảnh_của_bạn'} alt='Phản hồi của khách hàng'/>
                        </div>
                        <div className='p-4'>
                            <p className='text-gray-600 text-lg mb-4'>Không phải ngày nào bạn cũng gặp một nhà tư vấn tài chính đầy đam mê và đáng tin cậy. John Doe là một chuyên gia thực thụ và làm việc của mình rất tốt. Cảm ơn John!</p>
                            <p className='text-primary-color text-base font-bold'>Johnson.M.J.</p>
                            <p className='text-sm'>Giám đốc "Financial Times"</p>
                        </div>
                    </div>
                    <div className='card border border-gray-200 rounded-lg overflow-hidden shadow-md'>
                        <div className='p-4 bg-white'>
                            <img className='rounded-full w-24 h-24 mx-auto border-4 border-white transform -translate-y-1/2' src={'đường_dẫn_ảnh_của_bạn'} alt='Phản hồi của khách hàng'/>
                        </div>
                        <div className='p-4'>
                            <p className='text-gray-600 text-lg mb-4'>Không phải ngày nào bạn cũng gặp một nhà tư vấn tài chính đầy đam mê và đáng tin cậy. John Doe là một chuyên gia thực thụ và làm việc của mình rất tốt. Cảm ơn John!</p>
                            <p className='text-primary-color text-base font-bold'>Johnson.M.J.</p>
                            <p className='text-sm'>Giám đốc "Financial Times"</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Testimonials
