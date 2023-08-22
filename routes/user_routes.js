import { Router } from 'express'
import { UserModel } from '../db.js'

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

router.post('/', async (req, res) => {
    try {
        const insertedUser = await UserModel.create(req.body)
        res.status(201).send(insertedUser)
    } 
    catch (err) {
        res.status(500).send({ error: err.message} )
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