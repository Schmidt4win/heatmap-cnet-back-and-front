import mongoose, { Schema } from "mongoose";

const vlanSchema = new mongoose.Schema({
  id: { type: String },
  VLAN_name: { type: String, require: true, unique: true },
  VLAN_equipament: { type: String, require: true },
  VLAN_porpouse: { type: String, require: true },
});

const vlan = mongoose.model("vlan", vlanSchema);

export default vlan;
