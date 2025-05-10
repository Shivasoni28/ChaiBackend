import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadOnCloudinary = async (localFilePath) => {
    try {
      if (!localFilePath) return null;
  
      const response = await cloudinary.uploader.upload(localFilePath, {
        resource_type: "auto",
      });
  
      if (!response || !response?.url) {
        console.error("Cloudinary upload failed:", response);
        return null;
      }
  
      console.log("File uploaded on Cloudinary:", response.url);
      fs.unlinkSync(localFilePath); // Remove the temporary file after upload
      return response;
    } catch (error) {
      console.error("Cloudinary upload error:", error); // Log the error
      fs.unlinkSync(localFilePath); // Remove the temporary file
      return null;
    }
  };
  