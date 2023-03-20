import { Router } from "express";
import multer from "multer";
import uploadConfig from "../config/upload";

const upload = multer(uploadConfig)

const fileRoutes = Router()

// fileRoutes.post("/import", upload.single("file"), importFileController.handle)

export {fileRoutes}