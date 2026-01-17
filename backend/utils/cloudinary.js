import { v2 as cloudinary } from "cloudinary";

if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
) {
    throw new Error("Missing Cloudinary environment variables in .env file");
}

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

const uploadCloudinary = async (image) => {
    const res = await cloudinary.uploader.upload(image, {
        folder: "UserProfile",
    });

    return res.secure_url;
};

export default uploadCloudinary;
