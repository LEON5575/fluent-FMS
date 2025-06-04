const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Upload buffer to Cloudinary with token-based access control
 * @param {Buffer} buffer - file buffer to upload
 * @param {string} filename - file name (used as public_id)
 * @param {string} folder - Cloudinary folder to upload into
 * @returns {Promise<Object>} upload result from Cloudinary
 */
function uploadBufferToCloudinary(buffer, filename, folder = 'storage') {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({
      folder,
      public_id: filename.split('.')[0], // filename without extension as public_id
      access_control: [{ access_type: 'token', start: new Date().toISOString() }],
      resource_type: 'auto'
    }, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });

    streamifier.createReadStream(buffer).pipe(stream);
  });
}

/**
 * Generate signed token-based URL with expiration (default 1 hour)
 * @param {string} publicId - Cloudinary public ID of the uploaded file
 * @param {number} expiresInSeconds - time in seconds until the URL expires
 * @returns {string} signed URL
 */
function generateSignedUrl(publicId, expiresInSeconds = 3600) {
  return cloudinary.url(publicId, {
    type: 'authenticated',  // for token-based authenticated URLs
    sign_url: true,
    expires_at: Math.floor(Date.now() / 1000) + expiresInSeconds
  });
}

module.exports = {
  cloudinary,
  uploadBufferToCloudinary,
  generateSignedUrl
};
