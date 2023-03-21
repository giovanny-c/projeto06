import { container } from "tsyringe";
import "dotenv/config"

import { IStorageProvider } from "./IStorageProvider";
import { LocalStorageProvider } from "./implemantations/LocalStorageProvider";
//import { S3StorageProvider } from "./implementations/S3StorageProvider";

const storage = {
    local: LocalStorageProvider,
   // s3: S3StorageProvider
}

// const index = process.env.STORAGE as keyof typeof storage ;
// if (!storage.hasOwnProperty(index)) {
//   throw new Error(`Invalid storage type: ${index}`);
// }

container.registerSingleton<IStorageProvider>(
    "StorageProvider",
    storage[process.env.STORAGE as keyof typeof storage]
)