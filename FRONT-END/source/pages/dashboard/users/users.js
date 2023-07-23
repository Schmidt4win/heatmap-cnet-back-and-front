import { get, set, $ } from "../../../handleForm.js";
import { sendApiReq } from "../../../handleApiRequests.js";
import { logout } from "../../../logout.js";
import { triggerToast } from "../../../toast.js";

const userTable = $("#usersTableBody");
const form = $("#addUserForm");
const userModal = new bootstrap.Modal($("#addUsersModal"));
const popovers = [];

function setForm(user) {
  const { name, category, _id: id } = user.data;

  set("#userName", name);
  set("#userCategory", category);
  set("#userId", id);
}

$("#addUsersModal").addEventListener("hidden.bs.modal", function () {
  form.reset();
  set("#userId", "");
});

function showPopover(id, popoverInfo) {
  if (popovers.length > 0) popovers.forEach(popover => popover.hide());

  const popover = new bootstrap.Popover(document.getElementById(id), {
    title: `Número de Logins: ${popoverInfo.userLogin}`,
    content: `Data do último Login: ${popoverInfo.userLastLogin}`,
    trigger: "focus",
  });

  popovers.push(popover);

  popover.show();

  setTimeout(() => {
    popover.hide();
  }, 5000);
}

async function saveNewUser(reqBody) {
  const apiResponse = await sendApiReq({
    endpoint: "users",
    httpMethod: "POST",
    body: reqBody,
  });

  apiResponse.status === 201 &&
    triggerToast("usuário adicionado com sucess", true);
  renderUserTable();
}

async function editUserAndSave(reqBody, id) {
  const apiResponse = await sendApiReq({
    endpoint: `users/${id}`,
    httpMethod: "PUT",
    body: reqBody,
  });

  apiResponse.status === 200 &&
    triggerToast("usuário editado com sucesso", true);
  renderUserTable();
}

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const reqBody = {
    name: get("#userName"),
    password: get("#userPassword").trim(),
    category: get("#userCategory"),
  };

  console.log(reqBody)

  const userId = get("#userId");

  userId ? editUserAndSave(reqBody, userId) : saveNewUser(reqBody);

  userModal.hide();
  renderUserTable();
});

export async function fetchUsers() {
  const users = await sendApiReq({
    endpoint: "users",
    httpMethod: "GET",
  });

  const logins = await fetchLogins();

  return users.data.map(user => {
    const { loginCounter, lastDate } = logins[user?.name] || "indefinido";

    return {
      _id: user._id,
      name: user.name,
      category: user.category,
      loginCounter,
      lastDate,
    };
  });
}

async function fetchLogins() {
  const logins = await sendApiReq({
    endpoint: "logindataget",
    httpMethod: "GET",
  });

  const loginsByUser = {};

  return logins.data.reduce((_, current) => {
    if (loginsByUser[current.name]) {
      loginsByUser[current.name].loginCounter++;
    } else {
      loginsByUser[current.name] = { loginCounter: 1, lastDate: current.date };
    }

    return loginsByUser;
  });
}

function getTableColumn(data, index) {
  const { name, category, _id: id, loginCounter, lastDate } = data;

  return `<th scope="row">${index + 1}</th>
            <td id="${id}" 
              data-user-id="${id}"
              data-user-login="${loginCounter || ""}" 
              data-user-last-login="${
                lastDate?.split(" ")[0] || "sem registro"
              }"
              data-user-action="showPopover"
            >${name}</td>
            <td>${category}</td>
            <td>
              <div class="btn-group" role="group">
                <button 
                  type="button" 
                  class="btn btn-sm btn-secondary" 
                  data-user-id="${id}" 
                  data-user-action="delete"
                >
                  Excluir
                </button>
                <button 
                  type="button" 
                  class="btn btn-sm btn-secondary" 
                  data-user-id="${id}" 
                  data-user-action="edit"
                >
                  Editar
                </button>
              </div>
            </td>
    `;
}

function getTableRows(dataRows) {
  let rows = "";

  dataRows.forEach((data, index) => {
    let row = `<tr>${getTableColumn(data, index)}</tr>`;

    rows += row;
  });

  return rows;
}

async function setTableContent() {
  const data = await fetchUsers();

  const tableContent = getTableRows(data);

  return tableContent;
}

function renderUserTable() {
  setTableContent().then(data => (userTable.innerHTML = data));
}

async function deleteUser(id) {
  if (confirm("deseja excluir este usuário permanentemente?")) {
    const apiResponse = await sendApiReq({
      endpoint: `users/${id}`,
      httpMethod: "DELETE",
    });

    if (apiResponse.status == 200)
      triggerToast("usuário deletado com sucesso", true);

    renderUserTable();
  }
}

async function editUser(id) {
  const user = await sendApiReq({
    endpoint: `users/${id}`,
    httpMethod: "GET",
  });

  setForm(user);

  userModal.show();
}

userTable.addEventListener("click", function (event) {
  const { userId, userAction } = event.target.dataset;

  switch (userAction) {
    case "delete":
      deleteUser(userId);
      break;

    case "edit":
      editUser(userId);
      break;

    case "showPopover":
      const { userLogin, userLastLogin } = event.target.dataset;
      showPopover(userId, { userLogin, userLastLogin });
    default:
      break;
  }
});

renderUserTable();
