import OnuClient from "../models/onuClient.js";

class OnuController {
 
//   static ListarTrackingById = (req, res) => {
//     let name = req.body.user;
//     tracking
//       .findOne({ user: name }, (err, tracking) => {
//         let retorno = {
//           user: tracking.user,
//           lat: tracking.lat,
//           lng: tracking.lng,
//           date_time: tracking.date_time,
//         };
//         if (tracking) {
//           res.status(200).send(retorno);
//         } else {
//           res.status(400).send(false);
//         }
//       })
//       .sort({ _id: -1 });
//   };
static ListOnu = (req, res) => {
    OnuClient.find((err, user) => {
        res.status(200).json(user);
      });
}
}

export default OnuController;
