import { Router } from 'express'
import { UserModel } from '../db.js'
import jwt from 'jsonwebtoken'

const router = Router()

router.post('/', async (req, res) => {
    const { username, password } = req.body

    try {
        const user = await UserModel.findOne({ username })

        if (!user) {
            return res.status(401).send({ message: 'Invalid username or password' })
        }

        const isPasswordValid = await user.comparePassword(password)

        if (!isPasswordValid) {
            return res.status(401).send({ message: 'Invalid username or password' })
        }

        const accessToken = jwt.sign({ userId: user._id, isAdmin: user.isAdmin, name: user.name }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '6h'})

        const { password: excludedPassword, ...userWithoutPassword } = user.toObject()
        res.send({ user: userWithoutPassword, accessToken })

    } catch (error) {
        console.error(err)
        res.status(500).send({ error: err.message })
    }
    
})

export default router