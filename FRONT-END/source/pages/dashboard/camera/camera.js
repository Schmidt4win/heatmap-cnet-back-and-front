import { $ } from "../../../handleForm.js";
import { sendApiReq } from "../../../handleApiRequests.js";

const cameraTable = $("#cameraTableBody");
const modal = new bootstrap.Modal($("#showCameraImgModal"));

async function fetchCamera() {
  const cameras = await sendApiReq({
    endpoint: "getallcameras",
    httpMethod: "GET",
  });

  return cameras.data;
}

function getTableColumn(data, index) {
  const { clientCameraName, serialNumber, _id } = data;

  const paths = Object.keys(data).filter(key => key.startsWith("filePath"));

  const joinPaths = JSON.stringify(
    paths.map(path => ({
      filePath: data[path],
    }))
  );

  return `<th scope="row">${index + 1}</th>
              <td>${clientCameraName.toUpperCase()}</td>
              <td>${serialNumber}</td>
              <td>
                <button 
                type="button" 
                class="btn btn-sm btn-success" 
                data-camera-paths='${joinPaths}' 
                >
                <i class="bi bi-qr-code"></i>
                Abrir
                </button>
              </td>`;
}

function getTableRows(dataRows) {
  let rows = "";

  dataRows.forEach((data, index) => {
    let row = `<tr>${getTableColumn(data, index)}</tr>`;

    rows += row;
  });

  return rows;
}

async function setTableContent(hasFilter) {
  const data = await fetchCamera();
  let filterResults = false;
  if (hasFilter) {
    filterResults = data.filter(d => d?.clientCameraName.toLowerCase().includes(hasFilter));
  }

  const tableContent = getTableRows(hasFilter ? filterResults : data);

  return tableContent;
}

function renderCameraTable(withFilter = false) {
  setTableContent(withFilter).then(data => (cameraTable.innerHTML = data));
}

$("#searchCameraClientInput").addEventListener("keyup", function () {
  renderCameraTable(this.value.toLowerCase());
});

cameraTable.addEventListener("click", async function (e) {
  const paths = e.target.dataset?.cameraPaths;

  if (!e.target.dataset.cameraPaths) return;

  const filePaths = JSON.parse(paths);

  const imgFiles = await getCameraImgs(filePaths);

  const urlPromiseList = await readImgFiles(imgFiles);

  renderCarouselItems(await createCarouselItems(urlPromiseList));

  modal.show();
});

async function getCameraImgs(paths) {
  const response = await Promise.all(
    paths.map(filePath => {
      return fetch(`https://api.heatmap.conectnet.net/getcameraimg`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(filePath),
      });
    })
  );

  return response;
}

async function readImgFiles(files) {
  return files.map(async filePromise => {
    const blob = await filePromise.blob();

    const imageUrl = URL.createObjectURL(blob);

    return imageUrl;
  });
}

function createCarouselItems(urls) {
  return urls.reduce(async (htmlTextPromise, urlPromise) => {
    let htmlText = await htmlTextPromise;
    const url = await urlPromise;

    htmlText += `<div class="carousel-item">
      <img src="${url}" class="d-block w-100" height="auto">
    </div>`;

    return htmlText;
  }, Promise.resolve(""));
}

function renderCarouselItems(items) {
  $("#carouselInnerContainer").innerHTML = items.replace(
    `carousel-item`,
    `carousel-item active`
  );
}

renderCameraTable();
