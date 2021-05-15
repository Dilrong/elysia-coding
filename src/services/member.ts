import MemberModel from '../models/member'
import { Service } from 'typedi'
import Sequelize from 'sequelize'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'

dotenv.config()

interface Member {
    email: string;
    password: string;
    nickName: string;
}

@Service()
export default class MemberService {
    async signIn (email: string, password: string) {
        try {
            const memberVO = await MemberModel.findOne({
                attributes: ['id', 'password'],
                where: {
                  email: email
                }
              })
              let data = null
              const result = bcrypt.compareSync(password, memberVO!.password)
              if (result === true) {
                const refreshToken = jwt.sign({ }, process.env.JWT_KEY!, { expiresIn: '7d' })
                const member = await MemberModel.findOne({
                  attributes: ['id'],
                  where: { id: memberVO!.id }
                })
                await MemberModel.update({
                  refreshToken: refreshToken
                }, { where: { id: member!.id } })
                const accessToken = jwt.sign({ member }, process.env.JWT_KEY!, { expiresIn: '30m' })
                data = {
                  accessToken: `Bearer ${accessToken}`,
                  refreshToken: refreshToken
                }
              } else {
                return { code: 403, message: 'error', data: 'not Authorized' }
              }
              return { code: 200, message: 'success', data: data }
        } catch (err) {
            return { code: 400, message: 'error', data: err }
        }
    }

    async signUp (memberDTO: Member) {
        const isExistEmail = await MemberModel.findOne({
            where: {
                email: memberDTO.email
            }
        })

        const isExistName = await MemberModel.findOne({
            where: {
                nickName: memberDTO.nickName
            }
        })

        if (isExistEmail) {
            return { code: 400, message: 'error', data: 'email is exist.' }
        } else if (isExistName) {
            return { code: 400, message: 'error', data: 'nickName is exist.' }
        }

        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(memberDTO.password, salt)

        await MemberModel.create({
            email: memberDTO.email,
            password: hash,
            nickName: memberDTO.nickName,
            role: 'semi',
        })

        const currentMember = await MemberModel.findOne({
            attributes: {
                exclude: ['password', 'refreshToken']
            },
            where: {
                email: memberDTO.email
            }
        })

        return { code: 200, message: 'success', data: currentMember }
    }

    async refreshToken (accessToken: string, refreshToken: string) {
        try {
          accessToken = accessToken.slice(7, accessToken.length).trimLeft()
          jwt.verify(refreshToken, String(process.env.JWT_KEY))
          const decoded: any = jwt.verify(accessToken, String(process.env.JWT_KEY), { ignoreExpiration: true })
          const member = await MemberModel.findOne({
            attributes: ['id'],
            where: {
              id: decoded!.member!.id
            }
          })
          accessToken = jwt.sign({ member }, String(process.env.JWT_KEY), { expiresIn: '30m' })
    
          return { code: 200, message: 'success', data: `Bearer ${accessToken}` }
        } catch (err) {
          console.log(err)
          return { code: 400, message: 'error', data: err }
        }
      }

}