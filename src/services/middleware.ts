import MemberModel from '../models/member'
import jwt from 'jsonwebtoken'
import env from '../config'

export default class MiddlewareService {
  static async auth (token: string) {
    try {
      token = token.slice(7, token.length).trimLeft()
      const decoded: any = jwt.verify(token, env.jwt.key!)
      const member = await MemberModel.findOne({
        attributes: ['id', 'email', 'nickName'],
        where: {
          id: decoded!.member.id
        }
      })

      if(member) {
          return true
      }
    } catch (err) {
      return false
    }
  }
}