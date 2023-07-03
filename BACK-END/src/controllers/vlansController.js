import vlan from "../models/vlansModel.js";

class VlanController {
  static vlanSave = (req, res) => {
    let vlans = new vlan(req.body);
    vlans.save((err) => {
      if (err) {
        res
          .status(500)
          .send({ message: `${err.message} - falha ao cadastrar vlan.` });
      } else {
        res.status(201).send({ message: `VLAN cadastrada com sucesso.` });
      }
    });
  };
  static ListVlans = (req, res) => {
    vlan
      .find((err, vlan) => {
        res.status(200).send(vlan);
      })
      .sort({ _id: -1 });
  };
}

export default VlanController;
