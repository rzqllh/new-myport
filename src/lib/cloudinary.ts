/**
 * Cloudinary upload utility.
 * Uses unsigned upload preset for client-side uploads.
 */

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const UPLOAD_PRESET = "portfolio_unsigned"; // Create this in Cloudinary dashboard

/**
 * Upload a file to Cloudinary via unsigned upload.
 * Returns the secure URL and public ID.
 */
export async function uploadImage(
  file: File,
  folder = "portfolio"
): Promise<{ url: string; publicId: string }> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!response.ok) {
    throw new Error(`Cloudinary upload failed: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    url: data.secure_url as string,
    publicId: data.public_id as string,
  };
}

/**
 * Build an optimised Cloudinary URL with transformations.
 */
export function cloudinaryUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: number | "auto";
    format?: "auto" | "webp" | "avif";
    crop?: "fill" | "fit" | "scale" | "thumb";
  } = {}
): string {
  const {
    width,
    height,
    quality = "auto",
    format = "auto",
    crop = "fill",
  } = options;

  const transforms = [
    `f_${format}`,
    `q_${quality}`,
    crop && width ? `c_${crop}` : "",
    width ? `w_${width}` : "",
    height ? `h_${height}` : "",
  ]
    .filter((t): t is string => Boolean(t))
    .join(",");


  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transforms}/${publicId}`;
}
