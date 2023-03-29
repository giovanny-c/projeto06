
import * as fs from "fs"
import * as fsPromises from "fs/promises"
import { resolve } from "path";
import upload from "../../../../../config/upload";
import { AppError } from "../../../../../errors/AppError";
import * as util from "util"
import {once} from "events"
import * as stream from "stream"

import { IFilePath, IFileSystemProvider } from "../IFileSystemProvider";


class FileSystemProvider implements IFileSystemProvider {
    
    //pega do tmp folde (multer)
    async saveFromTmpFolder({ file, folder }: IFilePath): Promise<string> {
        try {


            //let [, file_type] = file.split(/\.(?!.*\.)/, 2) // separa no ultimo ponto para pegar o tipo do arquivo

            let dir = resolve(upload.tmpFolder, folder)
            //ver se funciona 
            //let dir = resolve(`${upload.tmpFolder}/${folder}`)

            if (!fs.existsSync(dir)) {
                fs.mkdir(dir, { recursive: true },
                    (err) => {
                        if (err) {
                            console.error(err)
                            throw new AppError("Não foi possivel salvar arquivo.")
                    }}    
                )
            }

            fs.rename( //poe o file outro lugar
                resolve(upload.tmpFolder, file),
                resolve(dir, file),
                (err) => {
                    if (err) {
                        console.error(err)
                        throw new AppError("Não foi possivel salvar arquivo.")
                    }
                }
            )

            return file

        } catch (error) {
            
            console.error(error)
            throw new AppError("Não foi possivel salvar arquivo.")
        
        }
    }
    // do tmp folder do multer
    async deleteFromTmpFolder({ file, folder }: IFilePath): Promise<void> {

        try {

            //let [, file_type] = file.split(/\.(?!.*\.)/, 2) // separa no ultimo ponto para pegar o tipo do arquivo ( o nome do arquivo salvo no bd)

            let dir = resolve(upload.tmpFolder, folder)

            const file_name = resolve(dir, file)

            try { //se nao existir o arquivo retorn a func
                fs.stat(file_name,
                    (err) => {
                        if(err) throw err
                })
            } catch {
                return
            }

            fs.unlink(file_name,  (err) => {
                if(err) throw err
            })

            let files = fs.readdirSync(dir)

            if (!files.length) {
                fs.rmdir(dir,  (err) => {
                    if(err) throw err
                })
            }

        } catch (error) {
            throw error
        }

    }

    saveAsync(dir: string, file_name:string, file: Uint8Array ): void{

        

        if (!fs.existsSync(dir)) {
            fs.mkdir(dir, { recursive: true },(err) => {if (err) {
                
                console.error(err)
                throw new AppError("Não foi possivel salvar arquivo.")

            }})
  
        }

        const file_path = resolve(dir, file_name)

        fs.writeFile(file_path, file,
                (err) => {
                    if (err) {
                        console.error(err)
                        throw new AppError("Não foi possivel salvar arquivo.")

                }

        })
        
            



    }

    async saveSync(dir: string, file_name:string, file: Uint8Array ): Promise<void>{


        try { 

            if (!fs.existsSync(dir)) {
                await fsPromises.mkdir(dir, { recursive: true })
                    //  (err) => {if (err) throw err}
                
            }

            const file_path = resolve(dir, file_name)
        //fsPromise.writeFile lento porem consegue escrever
            await fsPromises.writeFile(file_path, file)
            /*,
                    (err) => {
                        if (err) throw err
                }*/  
        } catch (error) {
            console.error(error)
            throw new AppError("Não foi possivel salvar arquivo.")

        }   
            



    }

    async getFile(dir: string, file_name: string, returnInBase64?: boolean): Promise<Buffer | string | void>{

        
 
        try {   
            const file_path = resolve(dir, file_name)
            const file = await fsPromises.readFile(file_path, {
                encoding: returnInBase64 ? "base64" : null 
            })


            return file
            
        } catch (error) {
            console.error(error)
            // throw new AppError("Não foi possivel ler o arquivo, ou ele nao existe.")
        }
    }
    
    
    async getFileNamesFromDir(dir: string): Promise<string[] | void>{
        
        let content
        
        try {   

            content = await fsPromises.readdir(dir)
            
            return content
            
        } catch (error) {
            
            return
        }
    }

    deleteFile(dir: string, file_name: string){

        const file_path = resolve(dir, file_name)

            try { //se nao existir o arquivo retorn a func
                fs.stat(file_path,
                    (err) => {
                        if(err) {
                            console.error(err)
                            return
                        }
                })
            } catch {
                return
            }

            //
            fs.unlink(file_path,  (err) => {
                if(err) {
                    console.error(err) 
                    return
                }
            })

    }
    

    async getFileWithStream(dir: string, file_name: string, encoding?: BufferEncoding){
        let data = ""

        const file_path = resolve(dir, file_name)

        try {
            
            await new Promise((resolve) => {
                
                fs.createReadStream(file_path, encoding || null)
                .on("error", (error) => {
                    if (error) {
                        console.error(error)
                    }
                })
                .on("data", (chunk) => {
                    data += chunk
                    
                   
                })
                .on("end", resolve)
            
                
            })

        } catch (error) {
            throw new AppError("Não foi possível ler o arquivo")
        }


        return data

    }
 

    saveFileStream(dir: string, file_name: string, file: Uint8Array | Buffer){

        const file_path = resolve(dir, file_name)

        const stream = fs.createWriteStream(file_path)

        stream.write(file, (err) => {
            if (err) {
                console.error(err)
                throw new AppError("Não foi possível salvar o arquivo")
        }})
        stream.end()
        
    }

    async writeFileStream(dir, file_name, iterable: Buffer | string | Uint8Array, encoding?: BufferEncoding) {
        //iterable = oque sera escrito no arquivo
        
        // transforma o metodo finished do stream, 
        //que é baseado em callback, em uma promessa
        const finished = util.promisify(stream.finished) 

        const file_path = resolve(dir, file_name)

        

        //cria uma stream de escrita dentro desse arquivo do filepath
        const writable = fs.createWriteStream(file_path)

        for await(const chunk of iterable){//para cada chunck do que será escrito
            
            if(!writable.write(chunk)){ // se nao tiver como escrever?
                //espera a stream emitir o evento "drain"
                //"once" cria uma promessa que é completada quando o emissor(eventEmitter)
                //emite determinado evento
                await once(writable, "drain")
            }

            
        }

        writable.end() //fecha a stream

        await finished(writable)//espera até acabar de escrever

    }
     
//pega um iteravel e poe num file
    async writeIterableToFile(dir, file_name, iterable: Buffer | string | Uint8Array, encoding?: BufferEncoding) {
        

        const file_path = resolve(dir, file_name)

        //transforma o pipeline que baseado em callback em promise
        const pipeline = util.promisify(stream.pipeline)
        

        //le o arquivo/dados que serão escritos
        let readable = stream.Readable.from(iterable, {encoding: encoding || null})
        
        //cria a stream de escrita
        const writable = fs.createWriteStream(file_path)

        //escreve
        await pipeline(readable, writable)      
        
    }   

    //copia um arquivo para outro
    copyFile( source: string, destination: string) {
        
        let readable = fs.createReadStream(source)
        
        let writable = fs.createWriteStream(destination)
        
        readable.on("error", (err) => {
            readable.destroy()
            console.error(err)
        })

        writable.on("error", (err) => {
            writable.destroy()
            console.error(err)
        })
        
        writable.on('close', ()=>{
            
        })

        readable.pipe(writable)

    }
}

export { FileSystemProvider }