import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        let folder = "uploads/others";

        if (file.mimetype.startsWith("image/")) {
            folder = "uploads/images";
        } else if (file.mimetype.startsWith("video/")) {
            folder = "uploads/videos";
        } else if (file.mimetype.startsWith("audio/")) {
            folder = "uploads/audio";
        } else {
            folder = "uploads/documents";
        }

        return { folder, resource_type: "auto", public_id: `${Date.now()}-${file.originalname.split(".")[0]}`, };
    },
});

export const upload = multer({ storage });