import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import cors from 'cors'
import { connectDb } from './db/db.js'
import userRouter from './routes/user.routes.js'


export const app=express()
app.use(cors())
app.use(express.json())

await connectDb(process.env.DB_CONNECTION_URL)


app.use('/api/users',userRouter)