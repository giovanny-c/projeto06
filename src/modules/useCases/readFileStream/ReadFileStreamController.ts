import {Request, Response} from "express"
import { container } from "tsyringe"
import { ReadFileStreamUseCase } from "./ReadFileStreamUseCase"



class ReadFileStreamController {


    async handle(req: Request, res: Response){

        const {file} = req

        const ReadFile = container.resolve(ReadFileStreamUseCase)

        const data = await ReadFile.execute(file)

        return res.status(200).json({data})
    }

}
export {ReadFileStreamController}