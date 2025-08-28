// helper/addToCart.js
import summuryAPI from "../Common";

const addToCart = async (id) => {
  try {
    const response = await fetch(summuryAPI.addToCart.url, {
      method: summuryAPI.addToCart.method,
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ productId: id }),
    });

    const responseData = await response.json();
    return responseData;
  } catch (err) {
    return { success: false, message: err.message || "Something went wrong" };
  }
};

export default addToCart;
