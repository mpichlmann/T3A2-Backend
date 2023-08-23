import { Router } from 'express'
import { UserModel } from '../db.js'
import bcrypt from 'bcrypt'
import { checkAdminMiddleware } from './admin.js'
const saltRounds = 10

const router = Router()

router.get('/', async (req, res) => res.status(200).send(await UserModel.find()))

router.get('/:id', async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id)
        if (user) {
            res.send(user)
        } else {
            res.status(404).send({ error: 'Student not found'})
        }
    }
    catch (err) {
        res.status(500).send({ error: err.message} )
    } 
})


// Create a new user
router.post('/', checkAdminMiddleware, async (req, res) => {
    try {
        const { username, password, name, isAdmin } = req.body;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, saltRounds)

        // Create the new user with the hashed password
        const newUser = await UserModel.create({
            username,
            password: hashedPassword,
            name,
            isAdmin
        })

        res.status(201).send(newUser)
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
})

// Search for users 

router.get('/search/:name', async (req, res) => {
    try {
        const searchName = req.params.name

        const users = await UserModel.find({ name: { $regex: searchName, $options: 'i' } })

        res.status(200).send(users)
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})

export default router