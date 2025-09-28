const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'listingImages', // Folder name in Cloudinary
        allowed_formats: ['jpeg', 'png', 'jpg'] // Allowed image formats
    },
});

module.exports = { cloudinary, storage };