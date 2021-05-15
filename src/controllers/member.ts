import express, { Request, Response, NextFunction } from 'express'
import { Container } from 'typedi'
import MemberService from '../services/member'

const router = express.Router()

router.post('/members/signin', async (req: Request, res: Response, next: NextFunction) => {
    const email = req.body.email
    const password = req.body.password
  
    const memberServiceInstance = Container.get(MemberService)
  
    const { code, message, data } = await memberServiceInstance.signIn(email, password)
  
    return res.status(code).json({ message, data })
  })

router.post('/members/signup', async (req: Request, res: Response, next: NextFunction) => {
    const memberDTO = req.body
    const memberServiceInstance = Container.get(MemberService)
  
    const { code, message, data } = await memberServiceInstance.signUp(memberDTO)
  
    return res.status(code).json({ message, data })
})

export default router