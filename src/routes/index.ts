import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
const router = express.Router()
dotenv.config()

export default router.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
      message: 'success',
      version: process.env.npm_package_version,
      data: 'hello, developer.'
    })
  })