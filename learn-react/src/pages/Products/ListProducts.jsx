import {useEffect, useState} from "react";
import AxiosClient from "../../apis/AxiosClient.js";
import ReactPaginate from "react-paginate";
import "../../../src/styles/index.css"
    import SearchBar from "../Search/index.jsx";
    import SlideShow from "../Slide/Slide-show.jsx";

export default function ListProduct (){

    const [product, setProducts] = useState([])
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 4;

    useEffect(() => {
        AxiosClient.get(`/get-productpages?page=${currentPage}&size=${itemsPerPage}`)
            .then((res) => {

                setProducts(res.content);
                setTotalPages(res.totalPages)
            })
            .catch((err) => {
                console.log(err);
            });
    }, [currentPage]);


    const handlePageClick = (selectedPage) => {
        setCurrentPage(selectedPage.selected);
    };
    return (

        <div className="bg-white">

            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                <div className="mb-5">

                    <i className="fas fa-search "></i>
                    <i className="fas fa-user-friends ml-2"></i>
                    <span className={"ml-2"}>Tìm kiếm</span>
                    <SearchBar/>
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">Customers also purchased</h2>

                <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                    {product.map((product) => (
                        <div key={product.id} className="group relative">
                            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                                <img
                                    src={product.photo}
                                    alt={"Product"}
                                    className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                                />
                            </div>
                            <div className="mt-4 flex justify-between">
                                <div>
                                    <h3 className="text-sm text-gray-700">
                                        <a href={product.href}>
                                            <span aria-hidden="true" className="absolute inset-0" />
                                            {product.name}
                                        </a>
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">{product.color}</p>
                                </div>
                                <p className="text-sm font-medium text-gray-900 text-red-600">{product.price}$</p>
                            </div>
                        </div>
                    ))}
                </div>



                <div className={"Navigate"}>
                    <ReactPaginate
                        className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                        aria-label="Pagination"
                        previousLabel={"Previous"}
                        nextLabel={"Next"}
                        breakLabel={"..."}
                        pageCount={totalPages}
                        onPageChange={handlePageClick}
                        //css
                        nextLinkClassName={"pagination__link"}
                        disabledClassName={"pagination__link--disabled"}
                        activeClassName={"pagination__link--active"}
                        pageClassName={"class_page"}
                    />
                </div>

               </div>

        </div>
    )

}