import login from "../models/loginModel.js";

class LoginController {
  static ListarLogin = (req, res) => {
    login
      .find((err, user) => {
        res.status(200).json(user);
      })
      .sort({ _id: -1 });
  };
}

export default LoginController;
