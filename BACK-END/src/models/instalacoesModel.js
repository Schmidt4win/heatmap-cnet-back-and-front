import mongoose, { Schema } from "mongoose";

const instalacoesFormSchema = new mongoose.Schema({
  name_client: { type: String, require: true },
  cto: { type: String, require: true },
  sinal: { type: String, require: true },
  mac_onu: { type: String, require: true },
  tecnico: { type: String, require: true },
  user: { type: String, require: true },
  date_time: { type: String, require: true },
});

const instalacoesForm = mongoose.model(
  "instalacoesForm",
  instalacoesFormSchema
);

export default instalacoesForm;
