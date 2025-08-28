const name = import.meta.env.VITE_CLOUDINARY_NAME;
const url = `https://api.cloudinary.com/v1_1/${name}/image/upload`;
const uploadImage = async (image) => {

    const formData = new FormData();

    console.log("Cloudinary Name:", name);

    formData.append("file", image);
    formData.append("upload_preset", "mern_product")


    try {
        const response = await fetch(url, {
            method: "POST",
            body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Upload failed", data);
            throw new Error(`Upload failed: ${response.status}`);
        }

        return data; // data.url will have the uploaded image URL
    } catch (error) {
        console.error("Image upload error:", error);
        throw error;
    }
};

export default uploadImage;