
import * as dotenv from "dotenv";
import express, { Request, Response, NextFunction } from 'express'
import cors from "cors";
import helmet from "helmet";

import indexRouter from './routes/index'
import v1Router from './routes/v1'

import './loaders/sequelize'
import 'reflect-metadata'
 
dotenv.config();

if (!process.env.PORT) {
    process.exit(1);
}
 
const PORT: number = parseInt(process.env.PORT as string, 10);
 
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/', indexRouter)
app.use('/', v1Router)

app.use((req:Request, res:Response, next:NextFunction) => {
  const err = new Error('Not Found') as Err
  err.status = 404
  next(err)
})

app.use((err: Err, req:Request, res:Response, next:NextFunction) => {
  res.status(err.status || 500)
  res.json({
    message: err.message,
    data: err.data
  })
})

const server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});