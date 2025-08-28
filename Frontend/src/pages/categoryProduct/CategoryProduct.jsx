import { useLocation, useNavigate, useParams } from "react-router-dom";
import productCategory from "../../helper/productCategory";
import VerticalCart from "../../Components/VerticalCart/VerticalCart";
import { useEffect, useState } from "react";
import { FaFilter } from "react-icons/fa";
import summuryAPI from "../../Common";
import AiChatBot from "../../Components/AiChatBot/AiChatBot";

export default function CategoryProduct() {
    const prames = useParams();
    const [data, setData] = useState([]);
    const [loading, serLoading] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [sortBy, setSortBy] = useState("");

    const naviget = useNavigate();
    const location = useLocation();

    const urlCategery = new URLSearchParams(location.search);
    const urlcategoryList = urlCategery.getAll("category");

    const urlcategoryListObject = {};
    urlcategoryList.forEach((el) => {
        urlcategoryListObject[el] = true;
    });

    const [filterCatrgoryList, setFilterCategorylist] = useState({});
    const [selectCategory, setSelectCategory] = useState(urlcategoryListObject);

    const fetchData = async () => {
        try {
            serLoading(true);
            const response = await fetch(summuryAPI.filter.url, {
                method: summuryAPI.filter.method,
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    category: filterCatrgoryList,
                }),
            });
            const dataResponse = await response.json();
            setData(dataResponse.data || []);
        } catch (err) {
            console.error("Error fetching products", err);
        } finally {
            serLoading(false);
        }
    };

    const handelSetSelect = (e) => {
        const { value, checked } = e.target;
        setSelectCategory((prev) => {
            return { ...prev, [value]: checked };
        });
    };

    useEffect(() => {
        fetchData();
    }, [filterCatrgoryList]);

    useEffect(() => {
        const arrayOfCategory = Object.keys(selectCategory)
            .map((categoryKeyName) => {
                if (selectCategory[categoryKeyName]) return categoryKeyName;
                return null;
            })
            .filter((el) => el !== null);

        setFilterCategorylist(arrayOfCategory);

        const urlForMate = arrayOfCategory
            .map((el) => `category=${el}`)
            .join("&");

        naviget(`/product-category?${urlForMate}`);
    }, [selectCategory]);

    const handelSort = (e) => {
        const value = e.target.value; // ✅ fix here
        setSortBy(value);

        setData((prev) => {
            const sorted = [...prev]; // ✅ create a copy first
            if (value === "asc") {
                sorted.sort((a, b) => a.sellingPrice - b.sellingPrice);
            }
            if (value === "dsc") {
                sorted.sort((a, b) => b.sellingPrice - a.sellingPrice);
            }
            return sorted;
        });
    };

    useEffect(() => {

    }, [sortBy])
    return (
        <div className="container mx-auto p-4">
            {/* Mobile Filter Toggle */}
            <div className="flex justify-between items-center mb-4 lg:hidden">
                <h2 className="text-lg font-semibold text-slate-700 capitalize">
                    {prames.categoryName}
                </h2>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-3 py-2 border rounded-md shadow-sm bg-white "
                >
                    <FaFilter />
                    <span>Filters</span>
                </button>
            </div>

            {/* Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-6">
                {/* Sidebar Filters */}
                <aside
                    className={`bg-white shadow-md rounded-xl p-4 h-fit lg:sticky lg:top-24 
          ${showFilters ? "block" : "hidden"} lg:block`}
                >
                    {/* Sort By */}
                    <div className="mb-6">
                        <h3 className="text-base font-semibold text-slate-600 border-b border-slate-200 pb-2">
                            Sort By
                        </h3>
                        <form className="text-sm flex flex-col gap-3 pt-3">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="sortBy"
                                    value={"asc"}
                                    checked={sortBy === "asc"}
                                    onChange={handelSort}
                                    className="accent-yellow-500"
                                />
                                <span>Price - Low to High</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="sortBy"
                                    value={"dsc"}
                                    onChange={handelSort}
                                    checked={sortBy === "dsc"}
                                    className="accent-yellow-500"
                                />
                                <span>Price - High to Low</span>
                            </label>
                        </form>
                    </div>

                    {/* Filter By Category */}
                    <div>
                        <h3 className="text-base font-semibold text-slate-600 border-b border-slate-200 pb-2">
                            Categories
                        </h3>
                        <form className="text-sm flex flex-col gap-3 pt-3">
                            {productCategory.map((el, index) => (
                                <label
                                    key={index}
                                    className="flex items-center gap-2 cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        name="category"
                                        id={el.value}
                                        value={el.value}
                                        onChange={handelSetSelect}
                                        checked={!!selectCategory[el.value]}
                                        className="accent-yellow-500"
                                    />
                                    <span>{el.label}</span>
                                </label>
                            ))}
                        </form>
                    </div>
                </aside>

                {/* Products Section */}
                <main className="h-auto">
                    <h2 className="hidden lg:block text-lg font-semibold text-slate-700 mb-4 capitalize">
                        Showing results for{" "}
                        <span className="text-yellow-600">{prames.categoryName}</span>
                    </h2>

                    {data.length !== 0 ? (
                        <VerticalCart data={data} loading={loading} />
                    ) : (
                        <p className="text-center text-slate-500">No products found.</p>
                    )}
                </main>
            </div>
            <AiChatBot/>
        </div>
    );
}
