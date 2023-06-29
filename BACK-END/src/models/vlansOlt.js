import mongoose from 'mongoose';

const vlanParksschema = new mongoose.Schema({
  ID: {
    type: String, required: true,
  },
  oltIp: {
    type: String, required: true,
  },
  oltPon: {
    type: String, required: true,
  },
});

const vlanModel = mongoose.model('vlanParks', vlanParksschema);

export default vlanModel;