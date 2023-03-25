import { inject, injectable } from "tsyringe";
import { IFileSystemProvider } from "../../../shared/container/providers/fileSystemProvider/IFileSystemProvider";
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


       
        const data = await this.FileSystemProvider.getFileStream( upload.tmpFolder , file.filename)
        // this.FileSystemProvider.deleteFile(file.destination, file.filename)

        return data
    }

}

export { ReadFileStreamUseCase}