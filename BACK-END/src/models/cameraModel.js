import mongoose, { Schema } from "mongoose";

const CameraSchema = new mongoose.Schema({
  id: { type: String },
  clientCameraName: { type: String, require: true },
  serialNumber: { type: String, require: true },
  filePath1: { type: String, require: true },
  filePath2: { type: String, require: true },
  registerDate: { type: String, require: true },
});

const cameraClient = mongoose.model("cameraClient", CameraSchema);

export default cameraClient;
