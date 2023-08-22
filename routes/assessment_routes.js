import { Router } from 'express'
import { AssessmentModel } from '../db.js'

const router = Router()

router.get('/', async (req, res) => {
    try {
        const assessments = await AssessmentModel.find()
            
        res.status(200).send(assessments)
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const assessment = await AssessmentModel.findById(req.params.id)
            .populate('student', 'name') 
            .populate('doneBy', 'username') 
            .populate('skills.skill', 'skillname')
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
        const insertedAssessment = await AssessmentModel.create(req.body)
        res.status(201).send(insertedAssessment)
    } 
    catch (err) {
        res.status(500).send({ error: err.message} )
    }
})

export default router