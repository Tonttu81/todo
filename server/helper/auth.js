import jwt from 'jsonwebtoken'
import { ApiError } from './apierror'

const { verify } = jwt

const auth = (req, _res, next) => {
    const [scheme, token] = req.get('authorization')?.split(' ') || []
    if (scheme !== 'Bearer' || !token) {
        const error = new ApiError('Authentication required', 401)
        return next(error)
    }

    try {
        req.user = verify(token, process.env.JWT_SECRET_KEY)
        return next()
    } catch {
        const error = new ApiError('Invalid or expired token', 401)
        return next(error)
    }
}

export { auth }