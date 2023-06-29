import fs from 'fs';
import path from "path";
import cameraClient from '../models/cameraModel.js';

class UploadController {
  static uploadImg = async (req, res) => {
    const { clientCameraName, serialNumber } = req.body;
    //const { originalname, path } = req.file;
    const { originalname: firstOriginalname, path: firstPath } = req.files[0];
    const { originalname: secondOriginalname, path: secondPath } = req.files[1];
    //const fileExtension = originalname.split('.').pop();
    const firstFileExtension = firstOriginalname.split('.').pop();
    const secondFileExtension = secondOriginalname.split('.').pop();
    // const newFileName = `${clientCameraName}FOTO1-${serialNumber}.${fileExtension}`;
    const firstNewFileName = `${clientCameraName}-FOTO1-${serialNumber}-1.${firstFileExtension}`;
    const secondNewFileName = `${clientCameraName}-FOTO2-${serialNumber}-2.${secondFileExtension}`;
    // const newPath = `/./CAMERAS/uploads/${newFileName}`;
    const firstNewPath = `/./CAMERAS/uploads/${firstNewFileName}`;
    const secondNewPath = `/./CAMERAS/uploads/${secondNewFileName}`;
    let now = new Date().toLocaleString("PT-br");
    let registerDate = now;
    let filePath1 = firstNewPath;
    let filePath2 = secondNewPath;
    let cameraData = {clientCameraName, serialNumber, registerDate, filePath1, filePath2}

    
    
    try {
      //await fs.promises.rename(path, newPath);
      await fs.promises.rename(firstPath, firstNewPath);
      await fs.promises.rename(secondPath, secondNewPath);

      let cameraClientNew = new cameraClient(cameraData)
      cameraClientNew.save((err) =>{
        if(err) {
            console.log({message: `${err.message} - falha ao cadastrar camera cliente.`})
        } else{
            console.log({message: `tudo certo ao cadastrar camera do cliente.`})
        }
    }) 

      console.log(`CAMERA DO CLIENTE: ${clientCameraName} cadastrada com sucesso.`)
      res.status(200).send({message:'Upload completed'});
    } catch (err) {
      console.error(err);
      res.status(500).send('Failed to rename the file.');
    }
  };

  

  static sendImg = (req, res) => {
    const filePath = req.body.filePath;

    console.log(req.body)
    
    if (!filePath) {
      return res.status(400).json({ error: 'Missing filePath parameter' });
    }
    
    try {
      const filePathString = filePath.toString();
      //console.log(filePathString);
    
      console.log("chegou na função de enviar");
    
      const absolutePath = path.resolve(filePathString);
      //console.log(absolutePath);
    
      res.sendFile(absolutePath);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  

static getCamerasimgs = (req, res) => {
    cameraClient.find((err, cameraClient)=>{
        res.status(200).send(cameraClient)
    }).sort({_id: -1})
}


}

export default UploadController;
