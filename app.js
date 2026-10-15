import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import cors from 'cors'
import { connectDb } from './db/db.js'
import userRouter from './routes/user.routes.js'
import cookieParser from 'cookie-parser'

export const app=express()
app.use(cors())
app.use(express.json())
app.use(cookieParser())
await connectDb(process.env.DB_CONNECTION_URL)
app.use('/api/users',userRouter)