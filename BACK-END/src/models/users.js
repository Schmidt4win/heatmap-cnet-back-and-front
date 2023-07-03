import mongoose, { Schema } from "mongoose";

const UserSchema = new mongoose.Schema({
  id: { type: String },
  name: { type: String, require: true, unique: true },
  password: { type: String, require: true },
  category: { type: String, require: true },
  token: { type: String },
});

const user = mongoose.model("user", UserSchema);

export default user;
