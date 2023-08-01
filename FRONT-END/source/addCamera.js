import { sendApiReq } from "./handleApiRequests.js";
import { $, get } from "./handleForm.js";
import { triggerToast } from "./toast.js";

const modal = new bootstrap.Modal($("#addCameraModal"));
const saveBtn = $("#saveCameraBtn");
const saveBtnLoader = $("#saveCameraLoader");

async function sendCamera(data) {
  const response = await sendApiReq({
    endpoint: "uploadimg",
    httpMethod: "POST",
    body: data,
    withFile: true,
  });

  return response;
}

$("#formFile").addEventListener("change", function () {
  const [file1, file2] = this.files;

  if (file1 && file2) {
    const imgUrl1 = URL.createObjectURL(file1);
    const imgUrl2 = URL.createObjectURL(file2);

    renderImgThumb(createFilePreviewItems([imgUrl1, imgUrl2]));

    $("#formFileCheck").classList.remove("d-none");
    $("#fileIputValidationMsg").classList.add("d-none");
  } else {
    alert("Apenas um arquivo selecionado");
  }
});

function createFilePreviewItems(files) {
  return files.reduce((htmlText, item) => {
    htmlText += `<img src="${item}" width="200px" height="200px">`;

    return htmlText;
  }, "");
}

function renderImgThumb(htmlTemplateStr) {
  $("#imgPreviewContainer").innerHTML = htmlTemplateStr;
}

$("#addCameraForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  if ($("#checkFiles").checked) {
    const data = new FormData(this);

    saveBtn.disabled = true;
    saveBtnLoader.classList.remove("d-none");

    const response = await sendCamera(data);

    if (response.status === 200) {
      triggerToast("Dados enviados com sucesso", true);
      $("#fileIputValidationMsg").classList.remove("d-none");
      this.reset();
      modal.hide();
    } else {
      triggerToast("Ocorreu um erro ao enviar os dadoas", false);
    }
  } else {
    triggerToast("Confirme os dados antes de enviar!", false);
  }

  saveBtn.disabled = false;
  saveBtnLoader.classList.add("d-none");
});
