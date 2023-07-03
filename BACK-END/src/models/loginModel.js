import mongoose, { Schema } from "mongoose";

const loginSchema = new mongoose.Schema({
  id: { type: String },
  name: { type: String, require: true },
  date: { type: String, require: true },
});

const login = mongoose.model("login", loginSchema);

export default login;
