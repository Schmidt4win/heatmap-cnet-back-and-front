import mongoose, { Schema } from "mongoose";

const TrackingSchema = new mongoose.Schema({
  user: { type: String, require: true },
  lat: { type: String, require: true },
  lng: { type: String, require: true },
  date_time: { type: String, require: true },
});

const tracking = mongoose.model("tracking", TrackingSchema);

export default tracking;
