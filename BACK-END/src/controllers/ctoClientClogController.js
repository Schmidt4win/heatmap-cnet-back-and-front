import ctoClientLog from "../models/ctoClientLogModel.js";

class CtoClientLogController {
  static CadastrarCtoClientLogN = (req, res, next) => {
    let CtoClientLogs = new ctoClientLog(req.body);
    CtoClientLogs.save((err) => {
      if (err) {
        res
          .status(500)
          .send({
            message: `${err.message} - falha ao cadastrar cliente a CTO.`,
          });
      } else {
        return next();
      }
    });
  };
}

export default CtoClientLogController;
