import app from './src/app.js'
import fs from'fs';
import https from 'https'
import cors from "cors";
import http from 'http';

const port = process.env.PORT || 5005; //always 5005
const host = '0.0.0.0';

// var privateKey  = fs.readFileSync('src/key.pem', 'utf8');
// var certificate = fs.readFileSync('src/cert.pem', 'utf8');

// var credentials = {key: privateKey, cert: certificate,};

const server = http.createServer(app);

server.listen(port, () => {
  console.log("server starting on port : " + port)
});
