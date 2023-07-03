import express from "express";
import BackupController from "../controllers/backupController.js";

const router = express.Router();

router
  .post("/backupclientemk", BackupController.mkBackup) // recebe dados e faz backup.
  .post("/backupclienteubnt", BackupController.ubntBackup); // recebe os dados e faz backup.
export default router;
