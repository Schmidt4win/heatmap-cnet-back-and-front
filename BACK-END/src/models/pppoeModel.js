import mongoose, { Schema } from "mongoose";

const pppoeDataSchema = new mongoose.Schema({
  id: { type: String },
  name: { type: String, require: true },
  lat: { type: String, require: true },
  lng: { type: String, require: true },
  cto_id: { type: String, require: true },
  cto_name: { type: String, require: true },
  pppoe: { type: String, require: true },
  pppoeVerified: { type: Boolean },
  city: { type: String, require: true },
});

const PppoeData = mongoose.model("PppoeData", pppoeDataSchema);

export default PppoeData;
