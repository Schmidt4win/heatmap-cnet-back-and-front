import tracking from "../models/trackingModel.js";

class TrakingController {
  static CadastrarTracking = (req, res, next) => {
    let trackings = new tracking(req.body);
    trackings.save((err) => {
      if (err) {
        res
          .status(500)
          .send({ message: `${err.message} - falha ao cadastrar traking.` });
      } else {
        res.status(201).send(req.body);
        return next();
      }
    });
  };

  static ListarTrackingById = (req, res) => {
    let name = req.body.user;
    tracking
      .findOne({ user: name }, (err, tracking) => {
        let retorno = {
          user: tracking.user,
          lat: tracking.lat,
          lng: tracking.lng,
          date_time: tracking.date_time,
        };
        if (tracking) {
          res.status(200).send(retorno);
        } else {
          res.status(400).send(false);
        }
      })
      .sort({ _id: -1 });
  };
}

export default TrakingController;
