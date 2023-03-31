import {Request, Response} from "express"
import { container } from "tsyringe"
import { ReadFileStreamUseCase } from "./ReadFileStreamUseCase"



class ReadFileStreamController {


    async handle(req: Request, res: Response){

        const {new_file_name} = req.body
        const {file} = req

        // const {range} = req.headers
        // console.log(range)

        const ReadFile = container.resolve(ReadFileStreamUseCase)

        const data = await ReadFile.execute(file, new_file_name)

        //escreve a stream no res que é uma writable stream
        //data.pipe(res)
    
        return res.send("ok")
    }

}
export {ReadFileStreamController}