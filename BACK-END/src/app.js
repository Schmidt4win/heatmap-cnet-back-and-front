import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import db from "./config/dbConnect.js"
import path from "path";
import { fileURLToPath } from 'url';
import reqMonitor from "./middleware/reqMonitor.js";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);


const app = express()

db.on("error", console.log.bind(console, 'erro de conexão'))
db.once('open', () => {
   let now = new Date().toLocaleString("PT-br");
    console.log(`conexão com o banco em: ${now}`)
})

app.use(
  cors({
    credentials: true,
  }),
  //reqMonitor
  );

app.get('/docapi', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});
app.get('/email', (req, res) => {
  res.sendFile(path.join(__dirname, '/email.html'));
});
app.get('/lista-email', (req, res) => {
  res.sendFile(path.join(__dirname, '/lista.html'));
});
app.use(express.json({limit: '50mb'})); //add {limit: '50mb'} referente ao erro PayloadTooLargeError: request entity too large

routes(app);

export default app