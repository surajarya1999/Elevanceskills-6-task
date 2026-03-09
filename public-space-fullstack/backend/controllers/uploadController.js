const { uploadToCloudinary } = require("../lib/cloudinary.js");

async function uploadFile(req, res) {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ success: false, message: "No file provided" });
    }

    const file = req.files.file;
    const isVideo = file.mimetype.startsWith("video/");
    const resourceType = isVideo ? "video" : "image";

    const { url, publicId } = await uploadToCloudinary(file.data, "public-space", resourceType);
    res.json({ success: true, url, publicId, mediaType: resourceType });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ success: false, message: "Upload failed" });
  }
}

module.exports = { uploadFile };
