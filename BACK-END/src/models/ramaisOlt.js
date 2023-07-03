import mongoose from "mongoose";

const ramaisparksschema = new mongoose.Schema({
  oltRamal: { type: String, required: true },
  oltIp: { type: String, required: true },
  oltPon: { type: String, required: true },
  ponVlan: { type: String, required: true },
});

const ramaisModel = mongoose.model("ramaisparks", ramaisparksschema);

export default ramaisModel;
