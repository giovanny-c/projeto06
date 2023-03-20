import { NextFunction, Request, Response } from "express"
import { AppError } from "./AppError"


export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    
    if (err instanceof AppError && err.statusCode === 429){
        console.error("Too many Requests")
        return res.status(429).json({error: err})
    }

    if (err instanceof AppError) {

        
        console.error(err)
        

        return res.status(err.statusCode).json({error: err.message})


    }

    
    

    console.error(err)

    
    return res.status(500).json({error: "Server error"})
}