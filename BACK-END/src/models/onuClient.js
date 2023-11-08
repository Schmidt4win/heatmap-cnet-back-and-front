import mongoose, { Schema } from "mongoose";

const onuClientSchema = new mongoose.Schema({
  id: { type: String },
  oltIp: { type: String, require: true },
  oltPon: { type: String, require: true },
  onuVlan: { type: String, require: true },
  onuSerial: { type: String, require: true },
  onuAlias: { type: String, require: true },
  user: { type: String, require: true },
  date_time: { type: String, require: true },
  cto:{ type: String, require: true },
  tecnico: { type: String, require: true },
  sinalTX: { type: String, require: true },
  sinalRX: { type: String, require: true }

});

const OnuClient = mongoose.model("OnuClient", onuClientSchema);

export default OnuClient;



