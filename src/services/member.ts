import MemberModel from '../models/member'
import { Service } from 'typedi'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
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

                return { code: 200, message: 'success', accessToken: accessToken, refreshToken: refreshToken }
              } else {
                return { code: 403, message: 'error', data: 'not Authorized' }
              }
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
              include: ['id', 'email', 'nickName', 'role']
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

    async signOut (token: string) {
        try {
          const memberId = await this.getMemberId(token)
          const member = await MemberModel.update({
            refreshToken: null
          }, { where: { id: memberId } })
    
          return { code: 200, message: 'success', data: member }
        } catch (err) {
          return { code: 400, message: 'error', data: err }
        }
    }

    async updateNickName (token: string, nickName: string) {
        try {
            const memberId = await this.getMemberId(token)
            const member = await MemberModel.update({
                nickName: nickName,
            }, {
                where: {
                    id: memberId
                },
                returning: true
            })

            return { code: 200, message: 'success', data: member }
        } catch (err) {
            return { code: 400, message: 'error', data: err }
        }
    }

    async updatePassword (token: string, password: string) {
        const memberId = await this.getMemberId(token)
        try {
            const salt = bcrypt.genSaltSync(10)
            const hash = bcrypt.hashSync(password, salt)

            const member = await MemberModel.update({
                password: hash,
            }, {
                where: {
                    id: memberId
                },
                returning: true
            })

            return { code: 200, message: 'success', data: member }
        } catch (err) {
            return { code: 400, message: 'error', data: err }
        }
    }

    async sendConfirmEmail (email: string) {
      try {
        const member = await MemberModel.findOne({
          attributes: ['email'],
          where: {
            email: email
          }
        })

        const key = crypto.randomBytes(256).toString('hex').substr(100, 10);

        await MemberModel.update({
          verifyKey: key
        }, { where: { email: email } })

        console.log(key)

        return { code: 200, message: 'success', data: member }
      } catch (err) {
        return { code: 400, message: 'error', data: err }
      }
    }

    async confirmEmail (email: string, key: string) {
      try {
        const member = await MemberModel.update({
          role: 'member'
        }, { where: { email: email, verifyKey: key } })

        return { code: 200, message: 'success', data: member }
      } catch (err) {
        return { code: 400, message: 'error', data: err }
      }
    }

    async getMemberId (token: string) {
        try {
          token = token.slice(7, token.length).trimLeft()
          const decoded: any = jwt.verify(token, String(process.env.JWT_KEY))
          const member = await MemberModel.findOne({
            attributes: ['id', 'email', 'nickName'],
            where: {
              id: decoded!.member.id
            }
          })
          return member!.id
        } catch (err) {
          console.log(err)
          return false
        }
    }
}