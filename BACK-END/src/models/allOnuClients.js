import mongoose, { Schema } from "mongoose";

const AllClientsRamalDataSchema = new mongoose.Schema({
  id: { type: String },
  oltIp: { type: String, require: true },
  oltRamal: { type: String, require: true },
  oltName: { type: String, require: true },
  clientes: { type: Object },
  date_time: { type: String, require: true },
 
});

const AllClientsRamalData = mongoose.model("AllClientsRamalData", AllClientsRamalDataSchema);

export default AllClientsRamalData;
