import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

// Configure Cloudinary if credentials exist
const isCloudinaryConfigured = () => {
  return (
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
};

if (isCloudinaryConfigured()) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

/**
 * Upload local file to Cloudinary or keep it locally based on configuration
 * @param {object} file Multer file object
 * @returns {Promise<string>} File access URL
 */
export const uploadFile = async (file) => {
  if (!file) return '';

  const useCloudinary = isCloudinaryConfigured() || process.env.UPLOAD_STORAGE_TYPE === 'cloudinary';

  if (useCloudinary) {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'rewa_connect',
      });
      // Delete temporary local file
      try {
        fs.unlinkSync(file.path);
      } catch (err) {
        console.error('Failed to delete temp file:', err);
      }
      return result.secure_url;
    } catch (error) {
      console.error('Cloudinary Upload Error, falling back to local storage:', error);
      // Fallback: copy/move file to local uploads and serve it
      return saveLocalFile(file);
    }
  } else {
    return saveLocalFile(file);
  }
};

/**
 * Save file to local uploads directory
 * @param {object} file 
 * @returns {string} Relative URL path
 */
const saveLocalFile = (file) => {
  const uploadsDir = path.join(process.cwd(), 'uploads');
  
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const newFileName = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
  const targetPath = path.join(uploadsDir, newFileName);

  // Move the file from temp location to permanent uploads location
  fs.renameSync(file.path, targetPath);
  
  // Return the relative URL of the file (Express will serve the /uploads directory)
  return `/uploads/${newFileName}`;
};
