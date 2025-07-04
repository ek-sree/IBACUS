import { UploadApiResponse, UploadApiErrorResponse } from "cloudinary";
import cloudinary from "./cloudinaryConfig.js";

export const uploadImageToCloudinary = async (fileBuffer: Buffer): Promise<UploadApiResponse> => {
  try {
    const result: UploadApiResponse = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'IBACUS',
          resource_type: "auto"
        },
        (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
          if (error) {
            reject(error); 
          } else if (result) {
            resolve(result);
          } else {
            reject(new Error('Unknown error occurred while uploading to Cloudinary')); 
          }
        }
      );
      stream.end(fileBuffer); 
    });

    return result;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

export const deleteImageFromCloudinary = async (imageUrl: string): Promise<void> => {
  try {
    const afterUpload = imageUrl.split('/upload/')[1]; 
    if (!afterUpload) throw new Error('Could not parse public_id from imageUrl');

    // Remove version part if present (v12345678/)
    const versionRemoved = afterUpload.replace(/^v\d+\//, '');

    // Remove file extension
    const publicId = versionRemoved.replace(/\.[^/.]+$/, '');

    await cloudinary.uploader.destroy(publicId); 
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw error;
  }
};

