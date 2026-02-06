// src/utils/cloudinaryUpload.js

export const uploadToCloudinary = async (file, userId) => {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", "profile_pics"); // ✅ correct preset
  formData.append("folder", `users/${userId}`); // ✅ per-user folder

  const response = await fetch(
    "https://api.cloudinary.com/v1_1/dtiyxzeo3/image/upload",
    {
      method: "POST",
      body: formData,
    },
  );

  if (!response.ok) {
    const error = await response.json();
    console.error("Cloudinary error:", error);
    throw new Error("Cloudinary upload failed");
  }

  return await response.json();
};
