import { Router } from 'express'
import { UserModel } from '../db.js'
import bcrypt from 'bcrypt'
import { checkAdminMiddleware } from './admin.js'
const saltRounds = 10

const router = Router()

// Get all users
router.get('/', checkAdminMiddleware, async (req, res) => {
    try {
        const users = await UserModel.find().select('-password')
        res.status(200).send(users);
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
})

// Search for users
router.get('/results', async (req, res) => {
    try {
        const searchName = req.query.search
        const users = await UserModel.find({ name: { $regex: searchName, $options: 'i' } }).select('-password')
        res.status(200).send(users)
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
})

// Get a specific user
router.get('/:id', async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id).select('-password')
        if (user) {
            res.status(200).send(user)
        } else {
            res.status(404).send({ error: 'Student not found'})
        }
    } catch (err) {
        res.status(500).send({ error: err.message} )
    } 
})

// Create a new user
router.post('/', checkAdminMiddleware, async (req, res) => {
    try {
        const { username, password, name, isAdmin } = req.body;
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        const newUser = await UserModel.create({
            username,
            password: hashedPassword,
            name,
            isAdmin
        })
        const { password: excludedPassword, ...userWithoutPassword } = newUser.toObject()
        res.status(201).send(userWithoutPassword)
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
})

// Edit a user
router.put('/:id', checkAdminMiddleware, async (req, res) => {
    try {
        const { username, password, name, isAdmin } = req.body
        let hashedPassword = password;
        if (password) {
            hashedPassword = await bcrypt.hash(password, saltRounds)
        }
        const user = await UserModel.findByIdAndUpdate(
            req.params.id,
            {
                username,
                password: hashedPassword,
                name,
                isAdmin
            },
            { new: true }
        )
        if (user) {
            user.save()
            const { password: excludedPassword, ...userWithoutPassword } = user.toObject()
            res.status(200).send(userWithoutPassword)
        } else {
            res.status(404).send({ error: 'User not found' })
        }
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
})

// Delete a user 
router.delete('/:id', checkAdminMiddleware, async (req, res) => {
    try {
        const user = await UserModel.findByIdAndDelete(req.params.id)
        if (user) {
            res.status(200).send({ message: 'User deleted successfully' })
        } else {
            res.status(404).send({ error: 'User not found' })
        }
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
})

export default router