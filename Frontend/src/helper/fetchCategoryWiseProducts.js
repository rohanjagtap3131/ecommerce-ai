import summuryAPI from "../Common";

const fetchCategoryWiseProducts = async (category) => {
    try {
        const response = await fetch(summuryAPI.categoryProdutes.url, {
            method: summuryAPI.categoryProdutes.method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ category })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const dataResponse = await response.json();
        return dataResponse;
    } catch (error) {
        console.error("Error fetching category-wise products:", error);
        return { data: [] }; // return empty array so UI doesn't break
    }
};

export default fetchCategoryWiseProducts;
