import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = "uploads/others";
    let resourceType = "image";

    if (file.mimetype.startsWith("image/")) {
      folder = "uploads/images";
      resourceType = "image";
    } 
    else if (file.mimetype === "application/pdf") {
      folder = "uploads/documents";
      resourceType = "image";   
    } 
    else if (file.mimetype.startsWith("video/")) {
      folder = "uploads/videos";
      resourceType = "video";
    } 
    else {
      folder = "uploads/others";
      resourceType = "raw";
    }

    return {
      folder,
      resource_type: resourceType,
      public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
      format: file.mimetype === "application/pdf" ? "pdf" : undefined,
      type: "upload"
    };
  },
});

export const upload = multer({ storage });