import { inject, injectable } from "tsyringe";
import { IFileSystemProvider } from "../../../shared/container/providers/storageProvider/IFileSystemProvider";
import { resolve } from "path"
import upload from "../../../config/upload";




@injectable()
class ReadFileStreamUseCase {

    constructor(
        @inject("FileSystemProvider")
        private FileSystemProvider: IFileSystemProvider
    ){

    }

    async execute(file: Express.Multer.File){

        this.FileSystemProvider.getFileStream( upload.tmpFolder , file.filename)



    }

}

export { ReadFileStreamUseCase }