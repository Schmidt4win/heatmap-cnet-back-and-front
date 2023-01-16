const fs = import("fs");

import needle from 'needle';
import fetch from 'node-fetch';

const path = import("path");


const coord = {
  lat: "-29.582734100531393",
  lng: "-50.9251693190768",
  range: "200000"
}

const reqConfig = {
  headers: {
    "Authorization": "ed46f52830170280baa29470f11dd4b4ef545579",
    "Content-Type": "application/json",
    "Accept-encoding": "application/json",
    "Access-Control-Allow-Origin": '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE'
  }
}


async function getAllClients() {
  try {
    const response = await fetch(`https://sp.tomodat.com.br/tomodat/api/clients/`, reqConfig)
    const data = await response.json()
    return data
  } catch (err) {
    console.error("erro " + err)
  }
}

function getClientsByCto(users, id) {
  return users.filter(user => user.ap_id_connected == id).map(user => user.name);
}


//pegar todos os pontos de acesso
async function getAllAcessPoints() {
  try {

    const response = await fetch(`https://sp.tomodat.com.br/tomodat/api/access_points/${coord.lat}/${coord.lng}/${coord.range}`, reqConfig)

    const data = await response.json()

    return data
  } catch (err) {
    console.error("erro " + err)
  }
}

// async function getAllAcessPointsSplitters() {
//   try {

//     const response = await fetch(`https://sp.tomodat.com.br/tomodat/api/clients/viability/${coord.lat}/${coord.lng}/${coord.range}`, reqConfig)

//     const data = await response.json()

//     return data
//   } catch (err) {
//     console.error("erro " + err)
//   }
// }

export async function getAllClientsByCto() {
  const apList = await getAllAcessPoints();
  // const splittersList = getAllAcessPointsSplitters();

  const ctoList = apList.filter(ap => ap.category === 5);

  const users = await getAllClients();

  const usersByCto = ctoList.map(cto => {
    return {
      id: cto.id,
      name: cto.name,
      coord: cto.dot,
      clients: getClientsByCto(users, cto.id),
      percentage_free: cto.percentage_free
      
    }
  });

  return usersByCto;

}

export async function getAllAcessPointsByCity() {
  try {

    const response = await fetch(`https://sp.tomodat.com.br/tomodat/api/access_points/list_path`, reqConfig)

    const data = await response.json()
    return data    
  } catch (err) {
    console.error("erro " + err)
  }
}

export function addClient(req, res) {
  let client = (req.body);
  needle.post(`https://sp.tomodat.com.br/tomodat/api/clients/auto_connect/`, client, reqConfig, 
  ((err) =>{
    if(err) {
        res.status(500).send({message: `${err.message} - falha ao cadastrar Cliente.`})
    } else{
        res.status(201).send({ApiTomodatCadastroOk: `${client.date_time}: Cliente ${client.name} cadastrado com sucesso na cto ${client.cto_name} pelo usuario: ${client.user}.`});
    }
}))
};


//padrão resposta json cadastro cliente
// {
//   "name":"TESTE 10",
//    "lat":"-29.585405",
//    "lng":"-50.896528", 
//    "cto_id":"3591",
//    "user": "vendas",
//    "cto_name":"R200",
//    "date_time": "24-12-22-10:56"
//        }