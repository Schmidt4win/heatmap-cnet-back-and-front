import mongoose, { Schema } from "mongoose";

const equipamentClientSchema = new mongoose.Schema({
  deviceName: { type: String, require: true },
  deviceIp: { type: String, require: true },
  deviceMac: { type: String, require: true },
  deviceType: { type: String, require: true },
  deviceCategory: { type: String, require: true },
});

const equipament = mongoose.model("equipament", equipamentClientSchema);

export default equipament;
