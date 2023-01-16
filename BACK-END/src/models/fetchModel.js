import mongoose, { Schema } from "mongoose";

const fetTomodatSchema = new mongoose.Schema(
     {
       id: {type: String, unique: true },
       name: {type: String, require: true}, 
       coord: {type: Object, require: true},
       cto_id: {type: String, require: true},
       clients: {type: Array, require: true},
       city: {type: String, require: true},
       percentage_free: {type: String, require: true}
      }
);

const fetTomodat= mongoose.model('fetchTomodat', fetTomodatSchema);


export default fetTomodat;