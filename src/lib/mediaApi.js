import { apiRequest } from "./api.js";

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024;

/**
 * Two-step upload documented in auth_company_product.md:
 * 1. ask the backend for a presigned uploadUrl + the future fileUrl
 * 2. PUT the raw file bytes straight to uploadUrl (bypasses our server)
 * fileUrl only resolves to a real file once step 2 succeeds.
 */
export async function uploadFile(file, folder) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Only PNG, JPEG or WEBP images are allowed.");
  }
  if (file.size > MAX_SIZE) {
    throw new Error("File must be 5MB or smaller.");
  }

  const { uploadUrl, fileUrl } = await apiRequest("/media/presigned-url", {
    method: "POST",
    auth: true,
    body: {
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      folder,
    },
  });

  const putRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });

  if (!putRes.ok) {
    throw new Error("Upload to storage failed. Please try again.");
  }

  return fileUrl;
}
