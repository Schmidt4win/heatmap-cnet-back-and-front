import mongoose from "mongoose";

const PppoeOnlineDataSchema = new mongoose.Schema({
  pppoe: { type: String, required: true },
  interface: { type: String, required: true },
  ipv4: { type: String, required: true },
  ipv6: { type: String, required: true },
  mac: { type: String, required: true },
  vlan: { type: String, required: true },
});

const PppoeOnlineData = mongoose.model(
  "PppoeOnlineData",
  PppoeOnlineDataSchema
);

export default PppoeOnlineData;
