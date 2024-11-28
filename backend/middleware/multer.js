import multer from "multer";
import { allowedImageFormats } from "../constants/fileFilters";
import path from "path"
import fs from "fs"
import sharp from "sharp"
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 1 mb max image size
  fileFilter: (req, file, cb) => {
    const allowedTypes = allowedImageFormats;
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image file formats are allowed"));
    }
  },
});



// compression for images 

export const compressImage = async (req, res, next) => {
    if (!req.file) {
      return next();
    }
  
    console.log(req.file);
  
    // Dynamically set the output file extension and path
    const timestamp = Date.now();
    const originalFormat = path.extname(req.file.originalname).toLowerCase(); // e.g., '.png', '.jpeg'
    const validFormats = ['.jpeg', '.jpg', '.png', '.webp', '.tiff', '.gif']; // Allowed formats
  
    // Ensure valid formats are handled
    const outputFormat = validFormats.includes(originalFormat) ? originalFormat : '.jpeg';
    const filename = `profile-${timestamp}${outputFormat}`;
    const outputPath = path.join(__dirname, '../public/uploads/profile', filename);
  
    try {
      const sharpInstance = sharp(req.file.buffer).resize(300, 300);
  
      // Dynamically handle output format and quality
      if (outputFormat === '.jpeg' || outputFormat === '.jpg') {
        await sharpInstance.jpeg({ quality: 75 }).toFile(outputPath);
      } else if (outputFormat === '.png') {
        await sharpInstance.png({ quality: 75 }).toFile(outputPath);
      } else if (outputFormat === '.webp') {
        await sharpInstance.webp({ quality: 75 }).toFile(outputPath);
      } else if (outputFormat === '.tiff') {
        await sharpInstance.tiff({ quality: 75 }).toFile(outputPath);
      } else if (outputFormat === '.gif') {
        // GIF compression (GIF support is limited with sharp)
        await sharpInstance.gif().toFile(outputPath);
      } else {
        // Fallback to JPEG
        await sharpInstance.jpeg({ quality: 75 }).toFile(outputPath);
      }
  
      // Save file path in the request object for further processing if needed
      req.file.compressedPath = outputPath;
  
      next(); // Proceed to the next middleware
    } catch (error) {
      console.error('Error compressing image:', error);
      res.status(500).send('Error processing the image');
    }
  };