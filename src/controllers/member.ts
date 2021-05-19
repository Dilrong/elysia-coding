import express, { Request, Response, NextFunction } from 'express'
import { Container } from 'typedi'
import MemberService from '../services/member'
import MiddlewareService from '../services/middleware'

const router = express.Router()

router.get('/members/email', async (req: Request, res: Response, next: NextFunction) => {
  const email = req.query.email
  const key = req.query.key
  const memberServiceInstance = Container.get(MemberService)

  const { code, message, data } = await memberServiceInstance.confirmEmail(String(email), String(key))

  return res.status(code).json({ message, data })
})

router.post('/members/signin', async (req: Request, res: Response, next: NextFunction) => {
    const email = req.body.email
    const password = req.body.password
  
    const memberServiceInstance = Container.get(MemberService)
  
    const { code, message, accessToken, refreshToken } = await memberServiceInstance.signIn(email, password)

    res.cookie('AccessToken', accessToken, { httpOnly: true })
    res.cookie('RefreshToken', refreshToken, { httpOnly: true})
    return res.status(code).json({ message })
  })

router.post('/members/signup', async (req: Request, res: Response, next: NextFunction) => {
    const memberDTO = req.body
    const memberServiceInstance = Container.get(MemberService)
  
    const { code, message, data } = await memberServiceInstance.signUp(memberDTO)
  
    return res.status(code).json({ message, data })
})

router.post('/members/signout', async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.cookies['accessToken']
  const memberServiceInstance = Container.get(MemberService)

  if (await MiddlewareService.auth(String(accessToken))) {
    const { code, message, data } = await memberServiceInstance.signOut(String(accessToken))
    return res.status(code).json({ message, data })
  } else {
    return res.status(403).json({ message: 'error', data: 'not Authorized' })
  }
})

router.post('/members/email', async (req: Request, res: Response, next: NextFunction) => {
  const email = req.body.email
  const memberServiceInstance = Container.get(MemberService)

  const { code, message, data } = await memberServiceInstance.sendConfirmEmail(email)

  return res.status(code).json({ message, data })
})

router.post('/members/refresh', async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.cookies['accessToken']
  const refreshToken = req.cookies['refreshToken']
  const memberServiceInstance = Container.get(MemberService)

  if (await MiddlewareService.auth(String(accessToken))) {
    const { code, message, data } = await memberServiceInstance.refreshToken(String(accessToken), refreshToken)
    return res.status(code).json({ message, data })
  } else {
    return res.status(403).json({ message: 'error', data: 'not Authorized' })
  }
})

router.post('/members/nickName', async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.cookies['accessToken']
  const nickName = req.body.nickName
  const memberServiceInstance = Container.get(MemberService)

  if (await MiddlewareService.auth(String(accessToken))) {
    const { code, message, data } = await memberServiceInstance.updateNickName(String(accessToken), nickName)
    return res.status(code).json({ message, data })
  } else {
    return res.status(403).json({ message: 'error', data: 'not Authorized' })
  }
})

router.post('/members/password', async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.cookies['accessToken']
  const password = req.body.password
  const memberServiceInstance = Container.get(MemberService)

  if (await MiddlewareService.auth(String(accessToken))) {
    const { code, message, data } = await memberServiceInstance.updatePassword(String(accessToken), password)
    return res.status(code).json({ message, data })
  } else {
    return res.status(403).json({ message: 'error', data: 'not Authorized' })
  }
})

export default router