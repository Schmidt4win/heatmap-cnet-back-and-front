import vlanModel from "../models/vlansOlt.js";

async function findMatchingData(oltIp, oltPon) {
  try {
    const matchingData = await vlanModel.find({
      $and: [
        { oltIp: oltIp },
        { oltPon: oltPon }
      ]
    });
    return matchingData;
  } catch (error) {
    // Handle any errors that occur during the query
    console.error('Error finding matching data:', error);
    throw error;
  }
}

// Usage:
let oltIp = "192.168.204.2";
let oltPon = "gpon1/11";

findMatchingData(oltIp, oltPon)
  .then((matchingData) => {
    console.log('Matching data:', matchingData);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
