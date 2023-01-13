import express from "express";
import needle from "needle";

function sendLogClient(){
    needle.post("https://api.heatmap.conectnet.net/logctoclient", 
    {
     name:"TESTE final2",
     lat:"-29.585405",
     lng:"-50.896528", 
     cto_id:"3591",
     user: "técnicos",
     cto_name:"Rteste",
     date_time: "24/12/22 10:58"
         }, 
    { json: true },
    ((err, res) =>{
        if(err) {
            console.log({message: `${err.message} - falha ao cadastrar user.`})
        } else{
            console.log(res.body); //{message: `${res.body.date_time}: Cliente ${res.body.name} cadastrado com sucesso na cto ${res.body.cto_name} pelo usuario: ${res.body.user}.`}
        }
    }))

};

function sendClient(){
    needle.post("https://api.heatmap.conectnet.net/client",
    {      
     name:"TESTE cliente e log",
     lat:"-29.585405",
     lng:"-50.896528", 
     cto_id:"3591",
     user: "técnicos",
     cto_name:"Rteste",
     date_time: "24/12/22 10:58"
             }, 
    { json: true }, 
    ((err, res) =>{
        if(err) {
            console.log({message: `${err.message} - falha ao cadastrar user.`})
        } else{
            console.log(res.body); //{message: `${client.date_time}: Cliente ${client.name} cadastrado com sucesso na cto ${client.cto_name} pelo usuario: ${client.user}.`}
        }
    }))

}

sendClient();
// sendLogClient();