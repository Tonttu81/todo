import { getAccount, insertAccount } from '../models/User.js'
import { ApiError } from '../helper/apierror.js'
import { compare, hash } from 'bcrypt'
import jwt from 'jsonwebtoken'

const { sign } = jwt

const signUp = async (req, res, next) => {
    try {
        const email = req.body.user?.email?.trim().toLowerCase()
        const password = req.body.user?.password

        if (!email || !password) {
            const error = new ApiError('Email and password are required', 400)
            return next(error)
        }

        const hashedPassword = await hash(password, 10)
        const result = await insertAccount(email, hashedPassword)
        
        return res.status(201).json(result.rows[0])
    } catch (error) {
        return next(error)
    }
}

const signIn = async (req, res, next) => {
    try {
        const email = req.body.user?.email?.trim().toLowerCase()
        const password = req.body.user?.password
        if (!email || !password) {
            const error = new ApiError('Email and password are required', 400)
            return next(error)
        }

        const result = await getAccount(email)

        const dbUser = result.rows[0]
        if (!dbUser || !(await compare(password, dbUser.password))) {
            const error = new ApiError('Invalid email or password', 401)
            return next(error)
        }

        const token = sign(
            { userId: dbUser.id, email: dbUser.email },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1h' },
        )
        return res.status(200).json({ id: dbUser.id, email: dbUser.email, token })
    } catch (error) {
        return next(error)
    }
}

export { signIn, signUp }