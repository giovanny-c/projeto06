import { container } from "tsyringe";
import "dotenv/config"

import { IFileSystemProvider } from "./IFileSystemProvider";
import { FileSystemProvider } from "./implemantations/FileSystemProvider";
//import { S3FileSystemProvider } from "./implementations/S3FileSystemProvider";

const storage = {
    local: FileSystemProvider,
   // s3: S3FileSystemProvider
}

// const index = process.env.STORAGE as keyof typeof storage ;
// if (!storage.hasOwnProperty(index)) {
//   throw new Error(`Invalid storage type: ${index}`);
// }

container.registerSingleton<IFileSystemProvider>(
    "FileSystemProvider",
    storage[process.env.STORAGE as keyof typeof storage]
)