import { Router } from 'express'
import { AssessmentModel } from '../db.js'
import { checkAdminMiddleware, getUserId, verifyUserMiddleware } from './admin.js'
import jwt from 'jsonwebtoken'

const router = Router()

// Get all assessments
router.get('/', verifyUserMiddleware, async (req, res) => {
    try {
        const assessments = await AssessmentModel.find()
            .populate('student', 'name') 
            .populate('doneBy', 'name') 
            .populate({path: 'skills.skill', select: 'skillName level'})
        res.status(200).send(assessments)
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
})

// Get all assessments from a specific student
router.get('/student/:studentId', verifyUserMiddleware, async (req, res) => {
    try {
        const assessments = await AssessmentModel.find({ student: req.params.studentId })
            .populate('student', 'name')
            .populate('doneBy', 'name')
            .populate({path: 'skills.skill', select: 'skillName level'})
        if (assessments.length > 0) {
            res.status(200).send(assessments)
        } else {
            res.status(404).send({ error: 'No assessments found for the specified student' })
        }
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
})

// Get a specific assessment
router.get('/:id', verifyUserMiddleware, async (req, res) => {
    try {
        const assessment = await AssessmentModel.findById(req.params.id)
            .populate('student', 'name') 
            .populate('doneBy', 'name') 
            .populate({path: 'skills.skill', select: 'skillName level'})
        if (assessment) {
            res.send(assessment)
        } else {
            res.status(404).send({ error: 'Assessment not found'})
        }
    } catch (err) {
        res.status(500).send({ error: err.message})
    } 
})

// Create a new assessment
router.post('/', getUserId, async (req, res) => {
    try {
        const { user } = req
        const insertedAssessment = await AssessmentModel.create({
            ...req.body,
            doneBy: user,
            Date: new Date(),
        })
        res.status(201).send(insertedAssessment)
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
})

// Update an assessment
router.put('/:id', checkAdminMiddleware, async (req, res) => {
    try {
        const assessment = await AssessmentModel.findByIdAndUpdate(req.params.id, req.body, {new: true })
            .populate('student', 'name') 
            .populate('doneBy', 'name') 
            .populate({path: 'skills.skill', select: 'skillName level'})
        if (assessment) {
            assessment.save()
            res.status(200).send(assessment)
        } else {
            res.status(404).send({ error: 'Assessment not found'})
    }
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
}) 

// Delete an assessment
router.delete('/:id', checkAdminMiddleware, async (req, res) => {
    try {
        const assessment = await AssessmentModel.findByIdAndDelete(req.params.id)
        if (assessment) {
            res.status(200).send({ message: 'Assessment deleted successfully' })
        } else {
            res.status(404).send({ error: 'Assessment not found' })
        }
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
})

export default router