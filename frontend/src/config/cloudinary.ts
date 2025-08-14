// Cloudinary Configuration
// Update these values with your actual Cloudinary credentials

export const CLOUDINARY_CONFIG = {
  // Your Cloudinary cloud name
  CLOUD_NAME: 'do4r15fue',
  
  // Your upload preset (must be configured in Cloudinary dashboard)
  UPLOAD_PRESET: 'english-community',
  
  // API base URL
  UPLOAD_URL: 'https://api.cloudinary.com/v1_1/do4r15fue/upload',
  
  // File size limits (in bytes)
  MAX_IMAGE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_AUDIO_SIZE: 50 * 1024 * 1024, // 50MB
  
  // Supported file types
  SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  SUPPORTED_AUDIO_TYPES: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4', 'audio/aac'],
};

// Helper function to build upload URL
export const getUploadUrl = () => {
  return `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.CLOUD_NAME}/upload`;
};
