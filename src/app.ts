
import "reflect-metadata"

import express from "express"

import cors from "cors"

import "express-async-errors"
import { router } from "./routes"
import { errorHandler } from "./errors/errorHandler"

import "./database/index"
import "./shared/container"

const app = express()

app.use(cors())

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(router)


app.use(errorHandler)

export {app}
