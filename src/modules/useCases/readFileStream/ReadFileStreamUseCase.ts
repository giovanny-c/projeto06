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
        
        //le o arquivo como stream e retorna
        const data = await this.FileSystemProvider.getFileWithStream( upload.tmpFolder , file.filename) 
        
            
        //copiam o data(iterable), mas nao da pra abrir, da como corrompido
        //await this.FileSystemProvider.writeFileStream(upload.tmpFolder , new_file_name, data)
        //await this.FileSystemProvider.writeIterableToFile(upload.tmpFolder , new_file_name, data.toString(), "binary")
        
        //copia do path, da pra abrir
        // this.FileSystemProvider.copyFile(destination, source)
        
        //deleta
        //this.FileSystemProvider.deleteFile(file.destination, file.filename)
    
        return fs.createReadStream(file.path)
    }

}

export { ReadFileStreamUseCase}