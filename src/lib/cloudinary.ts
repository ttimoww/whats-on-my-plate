import { env } from "@/env";
import {
  v2 as cloudinary,
  type UploadApiOptions,
  type UploadApiResponse,
} from "cloudinary";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads an image buffer to Cloudinary
 *
 * @returns The Cloudinary upload response
 */
export async function uploadImageToCloudinary({
  folder = "WOMP",
  buffer,
  filename,
}: {
  folder?: string;
  buffer: Buffer | Uint8Array;
  filename?: string;
}): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const uploadOptions: UploadApiOptions = {
      folder,
    };

    if (filename) {
      uploadOptions.public_id = filename; // Specify filename without extension
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error || !result) {
          reject(error);
        } else {
          resolve(result);
        }
      },
    );

    uploadStream.end(buffer);
  });
}
