const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Cloudflare credentials from .env
const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_API_KEY = process.env.CLOUDFLARE_IMAGES_API_KEY;
const CLOUDFLARE_ACCOUNT_HASH = process.env.CLOUDFLARE_ACCOUNT_HASH;

// Base URL for Cloudflare Images API
const CLOUDFLARE_API_URL = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/images/v1`;

/**
 * Upload an image to Cloudflare Images
 * @param {string} filePath - Path to the image file
 * @param {string} metadata - Optional metadata in JSON string format
 * @returns {Promise<object>} - Response from Cloudflare
 */
const uploadImage = async (filePath, metadata = '') => {
  try {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));
    
    if (metadata) {
      formData.append('metadata', metadata);
    }

    const response = await axios.post(CLOUDFLARE_API_URL, formData, {
      headers: {
        ...formData.getHeaders(),
        'Authorization': `Bearer ${CLOUDFLARE_API_KEY}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error uploading to Cloudflare Images:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Delete an image from Cloudflare Images
 * @param {string} imageId - ID of the image to delete
 * @returns {Promise<object>} - Response from Cloudflare
 */
const deleteImage = async (imageId) => {
  try {
    const response = await axios.delete(`${CLOUDFLARE_API_URL}/${imageId}`, {
      headers: {
        'Authorization': `Bearer ${CLOUDFLARE_API_KEY}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error deleting from Cloudflare Images:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Get a delivery URL for an image
 * @param {string} imageId - ID of the image
 * @param {string} variant - Variant name (default: 'public')
 * @returns {string} - URL to the image
 */
const getImageUrl = (imageId, variant = 'public') => {
  return `https://imagedelivery.net/${CLOUDFLARE_ACCOUNT_HASH}/${imageId}/${variant}`;
};

module.exports = {
  uploadImage,
  deleteImage,
  getImageUrl
}; 