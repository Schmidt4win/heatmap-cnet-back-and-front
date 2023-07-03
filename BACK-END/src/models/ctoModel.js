import mongoose, { Schema } from "mongoose";

const ctoSchema = new mongoose.Schema({
  id: { type: String },
  name: { type: String, require: true },
  lat: { type: String, require: true },
  lng: { type: String, require: true },
  cto_id: { type: String, require: true },
  clients: { type: Object, require: true },
});

const cto = mongoose.model("cto", ctoSchema);
