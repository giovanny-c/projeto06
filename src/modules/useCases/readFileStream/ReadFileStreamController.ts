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

        return res.status(200).json({data})
    }

}
export {ReadFileStreamController}