import mongoose, { Schema } from "mongoose";

const LogCtoClientSchema = new mongoose.Schema({
  id: { type: String },
  name: { type: String, require: true },
  lat: { type: String, require: true },
  lng: { type: String, require: true },
  cto_id: { type: String, require: true },
  user: { type: String, require: true },
  cto_name: { type: String, require: true },
  date_time: { type: String, require: true },
});

const logCtoClient = mongoose.model("logCtoClient", LogCtoClientSchema);

export default logCtoClient;
