import { $ } from "./handleForm.js";
import { sendApiReq } from "./handleApiRequests.js";
import { getPppoeStatus, generatePppoe } from "./pppoeUtils.js";

const openModal = new bootstrap.Modal($("#ctoModal"));
const clientsList = $("#modalClientsList");
const modalTitle = $("#ctoModalTitle");
const selectedClients = [];

function createCtoLink(pos) {
  return `https://www.google.com/maps/search/?api=1&query=${pos.lat},${pos.lng}`;
}

$("#ctoModal").addEventListener(
  "hide.bs.modal",
  () => (selectedClients.length = 0)
);

function showCheckBoxes() {
  const checkBoxes = document.querySelectorAll(".form-check-input");

  checkBoxes.forEach(check => check.classList.toggle("d-none"));
}

$("#admModeBtn").addEventListener("click", showCheckBoxes);

function renderClientsList(clients) {
  let list = "";

  clients.forEach(client => {
    let item = `<li class="list-group-item d-flex justify-content-between align-items-center" data-key="${
      client.id
    }">
      <div>
        <input class="form-check-input me-2 d-none" data-action="selectClient" type="checkbox" value="" id="${
          client.id
        }">
        <span data-client-id="${client.id}" class="me-3">${client.name}</span>
      </div>
      <div class="btn-group me-1">
      <button class="btn btn-outline-secondary btn-sm">
          <i class="bi bi-check-circle-fill" data-id="${
            client.id
          }" data-action="pppoeStatus" data-user-pppoe="${generatePppoe(
      client.name
    )}"></i>
        </button>
        <button class="btn btn-outline-secondary btn-sm">
          <i class="bi bi-clipboard" data-copy-to="unm" data-action="copyName" data-user-name="${
            client.name
          }"></i>
        </button>
        <button class="btn btn-outline-secondary btn-sm"> 
          <i class="bi bi-clipboard-minus" data-copy-to="parks" data-action="copyName" data-user-name="${
            client.name
          }"></i>
        </button>
      </div>
    </li>`;

    list += item;
  });

  return list;
}

function setClientsList(clients, id) {
  clientsList.innerHTML = renderClientsList(clients, id);
}

function setModalTitle(title, pos) {
  modalTitle.innerHTML = `<a href="${createCtoLink(
    pos
  )}" target="blank">${title}</a>`;
}

export function setFreePortsNumber(percetageFree, totalClients) {
  let isEmpty, isFull, freePorts, totalPorts;

  const occupiedPortsPercentage = 100 - percetageFree;

  if (occupiedPortsPercentage === 100) isFull = true;

  if (percetageFree === 100) isEmpty = true;

  if (!isFull && !isEmpty) {
    totalPorts = Math.ceil((100 * totalClients) / occupiedPortsPercentage);
    freePorts = totalPorts - totalClients;
  }

  return {
    isEmpty,
    isFull,
    freePorts,
    totalPorts,
  };
}

function toggleBtn(flag) {
  $("[data-bs-target='#addClientModal']").toggleAttribute("disabled", flag);
}

export function recalcFreePorts(totalClients, oldPercentage) {
  const { totalPorts, isEmpty } = setFreePortsNumber(
    oldPercentage,
    totalClients
  );

  let newPercentageFree;

  if (!isEmpty) {
    let newClientCount = totalClients + 1;
    newPercentageFree = ((totalPorts - newClientCount) * 100) / totalPorts;
  } else {
    newPercentageFree = 100;
  }

  return newPercentageFree;
}

function setModalInfo(info) {
  const { clients, name, coord, percentage_free, id } = info;

  $("#copyAllNames").addEventListener(
    "click",
    function () {
      let listName = "";
      clients.forEach(client => {
        listName += client.name + "\n";
      });
      navigator.clipboard.writeText(listName);
    },
    { once: true }
  );

  $("#copyAllNames").addEventListener(
    "contextmenu",
    function () {
      let listName = "";
      clients.forEach(client => {
        listName += hifenName(client.name) + "\n";
      });
      navigator.clipboard.writeText(listName);
    },
    { once: true }
  );

  setClientsList(clients, id);
  setModalTitle(name, coord);
  $("#clientsNumber").innerHTML = `<strong>${clients.length}</strong> clientes`;

  const { isEmpty, isFull, freePorts } = setFreePortsNumber(
    parseInt(percentage_free),
    clients.length
  );

  if (isEmpty || isFull) {
    $("#percentageFree").innerHTML = `<strong class="${
      isEmpty ? "text-success" : "text-danger"
    }">
      ${isEmpty ? "Cto vazia" : "Cto Lotada"}
    </strong>`;

    //toggleBtn(isEmpty ? false : true);
  } else {
    $(
      "#percentageFree"
    ).innerHTML = `<strong class="text-success">${freePorts} vagas</strong>`;
  }
  toggleBtn(false);

  openModal.show();
}

function hifenName(name) {
  const nameString = name.split("");
  nameString.forEach((char, index) => {
    if (char === "(") {
      nameString.splice(index);
    }
  });

  return nameString.join("").trim().split(" ").join("-");
}

function copyClientName(data, event) {
  const { userName, copyTo } = data;
  const el = event.target;

  navigator.clipboard.writeText(
    copyTo === "unm" ? userName : hifenName(userName)
  );

  let icon = el.classList[1];

  [icon, "bi-clipboard-check-fill"].forEach(className =>
    el.classList.toggle(className)
  );

  setTimeout(() => {
    el.classList.remove("bi-clipboard-check-fill");
    el.classList.add(icon);
  }, 1500);
}

function markTextAsSelected(el) {
  el.classList.toggle("text-decoration-line-through");

  const id = el.dataset.clientId;

  if (!selectedClients.find(client => client == id)) selectedClients.push(id);
  else selectedClients.splice(selectedClients.indexOf(id), 1);

  console.log(selectedClients);

  if (selectedClients.length > 0)
    $("#deleteClient").removeAttribute("disabled");
  else $("#deleteClient").setAttribute("disabled", "");
}

async function highlightPppoeStatus(data) {
  const { id, userPppoe } = data;

  const isPppoeOnline = await getPppoeStatus(userPppoe);

  $(`[data-key="${id}"]`).classList.add(
    `${isPppoeOnline ? "text-success" : "text-danger"}`
  );

  alert("Cliente Online");
}

$("#modalClientsList").addEventListener("click", function (event) {
  const data = event.target.dataset;

  console.log(data);

  if (Object.keys(data).length > 0) {
    switch (data.action) {
      case "copyName":
        copyClientName(data, event);
        break;

      case "selectClient":
        markTextAsSelected($(`[data-client-id="${event.target.id}"]`));
        break;

      case "pppoeStatus":
        highlightPppoeStatus(data);
        break;
    }
  }
});

async function deleteClient() {
  const deleted = await Promise.all(
    selectedClients.map(client => {
      console.log(`deleteclientfromtomodat/${client}`);
      return sendApiReq({
        endpoint: `deleteclientfromtomodat/${client}`,
        httpMethod: "DELETE",
      });
    })
  );

  console.log(deleted);

  if (deleted.every(del => del.status === 201)) {
    alert("clientes Deletados com sucesso");

    selectedClients.forEach(client => {
      $(`[data-key="${client}"]`).classList.add("d-none");
    });

    $("#deleteClient").setAttribute("disabled", "");

    selectedClients.length = 0;
  } else {
    alert("erro ao deletar cliente");
  }
}

$("#deleteClient").addEventListener("click", deleteClient);

export default setModalInfo;
