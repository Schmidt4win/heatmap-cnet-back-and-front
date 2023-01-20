import needle from "needle";
import fetTomodat from "../models/fetchModel.js"
import { fetchTomodat } from "../scripts/fetchApiTomodat.js"
import db from "../config/dbConnect.js"


db.on("error", console.log.bind(console, 'erro de conexão'))
db.once('open', () => {
    let now = new Date().toLocaleString("PT-br");
    console.log(`conexão com o banco em: ${now}`)
})


function cadastroFetch(){
    let now = new Date().toLocaleString("PT-br");
    fetchTomodat().then(data => {
        data.forEach(element => {
          JSON.stringify(element)
          let fet = new fetTomodat(element);
          fet.save((err) =>{
            if(err) {
                console.log(`${err.message} - falha ao cadastrar em: ${now}.`)
            } else{
              console.log(`elemento do fetch cadastrado com sucesso em: ${now}`)
            }
        });
        });
        
        })
        console.log(`fetch totalmente cadastrado com sucesso em: ${now}`)
    };


setInterval(cadastroFetch, 21600000) // setinterval = 6h (21600000)

