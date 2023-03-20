import multer from "multer"

import * as crypto from "crypto"

import {resolve} from "path"

const tmpFolder = resolve(__dirname, "..", "..", "tmp")

export default {
    tmpFolder,

    storage: multer.diskStorage({
        destination: tmpFolder,

        filename: (req, file, cb) => {

            const fileHash = crypto.randomBytes(16).toString("hex")

            const filename = `${fileHash}-${file.originalname}`
        
            return cb(null, filename)
        }
    })
}