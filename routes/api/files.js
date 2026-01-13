import express from "express";
import fileUpload from "express-fileupload";

import { filesCtrl } from "../../controllers/index.js";

const router = express.Router();

router.use(
  fileUpload({
    limits: { fileSize: 16 * 1024 * 1024 },
  })
);

router.get("/", filesCtrl.getAllFiles);
router.post("/", filesCtrl.addFile);
router.delete("/:id", filesCtrl.deleteFile);

export default router;
