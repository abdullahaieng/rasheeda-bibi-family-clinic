const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

function cloudinaryImage(publicId, fallback) {
  if (!cloudName || !publicId) return fallback;

  return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto/${publicId}`;
}

export const clinicImages = {
  logo: cloudinaryImage(import.meta.env.VITE_CLOUDINARY_LOGO_ID, "/logo.png"),
  ultrasound: cloudinaryImage(import.meta.env.VITE_CLOUDINARY_ULTRASOUND_ID, "/ultrasound.png"),
  background: cloudinaryImage(import.meta.env.VITE_CLOUDINARY_BACKGROUND_ID, "/Background.png"),
};