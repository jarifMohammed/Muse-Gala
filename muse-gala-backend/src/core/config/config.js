import dotenv from 'dotenv';
dotenv.config();

// Server config 
export const port = process.env.PORT || 3000;
export const mongoURI = process.env.MONGO_URI;
export const env = process.env.NODE_ENV || 'development';

// JWT config 
export const jwtSecret = process.env.JWT_SECRET;
export const jwtExpire = process.env.JWT_EXPIRE || '1h';
export const accessTokenSecrete = process.env.ACCESS_TOKEN_SECRET;
export const accessTokenExpires = process.env.ACCESS_TOKEN_EXPIRES || '15m';
export const refreshTokenSecrete = process.env.REFRESH_TOKEN_SECRET;
export const refreshTokenExpires = process.env.REFRESH_TOKEN_EXPIRES || '7d';
export const salt = process.env.SALT;

// Email config 
export const emailExpires = parseInt(process.env.EMAIL_EXPIRES || 15 * 60 * 1000); 
export const resendApiKey = process.env.RESEND_API_KEY;
export const emailFrom = process.env.EMAIL_FROM;
export const adminEmail = process.env.ADMIN_EMAIL;

// Cloudinary config
export const cloudinaryCloudName = process.env.CLOUDINARY_CLOUD_NAME;
export const cloudinaryApiKey = process.env.CLOUDINARY_API_KEY;
export const cloudinarySecret = process.env.CLOUDINARY_API_SECRET;
