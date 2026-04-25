import axios from "axios";
import { Platform } from "react-native";

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/ducorig4o/image/upload";
const UPLOAD_PRESET = "myfarmsight";

const IMAGE_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".heic",
  ".heif",
];
const VIDEO_EXTENSIONS = [
  ".mp4",
  ".mov",
  ".mkv",
  ".webm",
  ".avi",
  ".3gp",
];

export async function uploadToCloudinary(fileUri: string): Promise<string | null> {
  try {
    const formData = new FormData();
    const normalizedUri = fileUri.toLowerCase();
    const isVideo = VIDEO_EXTENSIONS.some((ext) => normalizedUri.endsWith(ext));
    const isImage = IMAGE_EXTENSIONS.some((ext) => normalizedUri.endsWith(ext));

    const type = isVideo ? "video/mp4" : isImage ? "image/jpeg" : "image/jpeg";
    const name = isVideo ? "upload.mp4" : "upload.jpg";
    const uploadUrl = CLOUDINARY_URL.replace("/image/", "/auto/");

    const fileToUpload = {
      uri: Platform.OS === "android" ? fileUri : fileUri.replace("file://", ""),
      type,
      name,
    } as any;

    formData.append("file", fileToUpload);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("resource_type", "auto");

    const response = await axios.post(uploadUrl, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        const total = progressEvent.total || 1;
        const percentCompleted = Math.round((progressEvent.loaded * 100) / total);
        console.log(`Upload progress: ${percentCompleted}%`);
      },
    });

    return response.data?.secure_url ?? null;
  } catch (error: any) {
    console.error("Cloudinary Upload Error:", error.response?.data || error.message);
    return null;
  }
}
