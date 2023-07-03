import mongoose, { Schema } from "mongoose";

const CtoClientLogSchema = new mongoose.Schema({
  id: { type: String },
  name: { type: String, require: true },
  lat: { type: String, require: true },
  lng: { type: String, require: true },
  cto_id: { type: String, require: true },
  user: { type: String, require: true },
  date_time: { type: String, require: true },
});

const ctoClientLog = mongoose.model("CtoClientLog", CtoClientLogSchema);

export default ctoClientLog;
