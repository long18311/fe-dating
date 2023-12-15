import  { useState, useEffect, useRef } from 'react';
import AxiosClient from "../../apis/AxiosClient.js";

function InfiniteScrollList() {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const pageSize = 20;
    const containerRef = useRef(null);

    const fetchMoreData = async () => {
        setIsLoading(true);
        try {
            const response = await AxiosClient.get(`https://jsonplaceholder.typicode.com/photos?page=${page}&pageSize=${pageSize}`);
            const newData = response;
            setUsers([...users, ...newData]);
            setPage(page + 1);
        } catch (error) {
            console.error("Error fetching data: ", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleScroll = () => {
        if (
            containerRef.current &&
            containerRef.current.scrollHeight - containerRef.current.scrollTop ===
            containerRef.current.clientHeight
        ) {
            fetchMoreData();
        }
    };

    useEffect(() => {
        fetchMoreData();
    }, []);

    useEffect(() => {
        // Lắng nghe sự kiện scroll trên phần tử container thay vì toàn bộ cửa sổ
        containerRef.current.addEventListener('scroll', handleScroll);
        return () => {
            containerRef.current.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div
            className={"mt-10 ml-20"}
            ref={containerRef}
            style={{ width:'1000px' , overflow: 'auto' }}
        >
            {users.map((user) => (
                <div key={user.id}>
                    <span>{user.title}</span>
                   <img src={user.url}/>
                </div>
            ))}
            {isLoading && <p>Đang tải...</p>}
        </div>
    );
}

export default InfiniteScrollList;
