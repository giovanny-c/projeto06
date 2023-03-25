import { Router } from "express";
import multer from "multer";
import uploadConfig from "../config/upload";
import { ReadFileStreamController } from "../modules/useCases/readFileStream/ReadFileStreamController";

const upload = multer(uploadConfig)

const fileRoutes = Router()

const readFileStreamController = new ReadFileStreamController()


fileRoutes.get("/", (req, res) => {

    return res.json("WORKING")

})
fileRoutes.post("/read-file-stream", upload.single("file"), readFileStreamController.handle)

export {fileRoutes}