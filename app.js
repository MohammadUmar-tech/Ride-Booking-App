import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import cors from 'cors'
import { connectDb } from './db/db.js'
import userRouter from './routes/user.routes.js'
import cookieParser from 'cookie-parser'
import captainRouter from './routes/captain.routes.js'
import mapRouter from './routes/map.routes.js'
export const app=express()
app.use(cors())
app.use(express.json())
app.use(cookieParser())
await connectDb(process.env.DB_CONNECTION_URL)
app.use('/api/maps',mapRouter)
app.use('/api/users',userRouter)
app.use('/api/captains',captainRouter)