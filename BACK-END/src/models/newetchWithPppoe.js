import mongoose, { Schema } from "mongoose";

const newFetchSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  id: { type: String, required: true },
  name: { type: String, required: true },
  coord: {
    id: { type: Number, required: true },
    lat: { type: String, required: true },
    lng: { type: String, required: true },
  },
  clients: [
    {
      name: { type: String, required: true },
      id: { type: Number, required: true },
      _id: { type: String },
      pppoe: { type: String },
      pppoe_name: { type: String },
      verified: { type: Boolean, default: false },
    },
  ],
  city: { type: String, required: true },
  percentage_free: { type: String, required: true },
});

const newFetch = mongoose.model("newFetch", newFetchSchema);

export default newFetch;
