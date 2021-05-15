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

}