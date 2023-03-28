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

    async execute(file: Express.Multer.File, new_file_name: string ){

        
        const data = await this.FileSystemProvider.getFileWithStream( upload.tmpFolder , file.filename)
        
       
        //por que o arquivo nao abre, apos fazer uma stream dele
        await this.FileSystemProvider.writeFileStream(upload.tmpFolder , "new_file_name.jpg", data)

        await this.FileSystemProvider.writeIterableToFile(upload.tmpFolder , new_file_name, data)
        
        
        
        this.FileSystemProvider.deleteFile(file.destination, file.filename)
        
        
        return data
    }

}

export { ReadFileStreamUseCase}