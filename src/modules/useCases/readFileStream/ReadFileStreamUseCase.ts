import { inject, injectable } from "tsyringe";
import { IFileSystemProvider } from "../../../shared/container/providers/fileSystemProvider/IFileSystemProvider";
import { resolve } from "path"
import upload from "../../../config/upload";
import * as fs from "fs"



@injectable()
class ReadFileStreamUseCase {

    constructor(
        @inject("FileSystemProvider")
        private FileSystemProvider: IFileSystemProvider
    ){

    }

    async execute(file: Express.Multer.File, new_file_name: string ){

        const destination = resolve(upload.tmpFolder, new_file_name)
        const source = file.path
        
        const data = await this.FileSystemProvider.getFileWithStream( upload.tmpFolder , file.filename) 
        // this.FileSystemProvider.saveFileStream(upload.tmpFolder, "aFile.jpg", data)
        // //por que o arquivo nao abre, apos fazer uma stream dele
        // await this.FileSystemProvider.writeFileStream(upload.tmpFolder , "new_file_name.jpg", data)

        let dat = fs.readFileSync(file.path)
        await this.FileSystemProvider.writeIterableToFile(upload.tmpFolder , new_file_name, dat)
        //this.FileSystemProvider.deleteFile(file.destination, file.filename)
        

        // this.FileSystemProvider.copyFile(destination, source)
        
    }

}

export { ReadFileStreamUseCase}