import { Router } from 'express'
import { AssessmentModel } from '../db.js'

const router = Router()

router.get('/', async (req, res) => res.status(200).send(await AssessmentModel.find()))

router.get('/:id', async (req, res) => {
    try {
        const assessment = await AssessmentModel.findById(req.params.id)
        if (assessment) {
            res.send(assessment)
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

export default router