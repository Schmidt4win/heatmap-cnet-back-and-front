import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config()

// import config from "../config/dbConnect.js"
const config = process.env;

const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  } else {
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }}
  return next();
};

export default verifyToken;