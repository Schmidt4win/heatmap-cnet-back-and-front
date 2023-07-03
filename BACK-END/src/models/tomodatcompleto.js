import mongoose, { Schema } from "mongoose";

const Tomodatcompleto16052023 = new mongoose.Schema({
  id: { type: String },
  name: { type: String, require: true },
  pointA: { type: Object, require: true },
  pointB: { type: Object, require: true },
  waypoints: { type: Array, require: true },
});

const tomodatcompleto16052023 = mongoose.model(
  "tomodatcompleto1605203",
  Tomodatcompleto16052023
);

export default tomodatcompleto16052023;
