import { Router } from 'express'
import { AssessmentModel } from '../db.js'
import { checkAdminMiddleware } from './admin.js'

const router = Router()

// 
router.get('/', async (req, res) => {
    try {
        const assessments = await AssessmentModel.find()
            .populate('student', 'name') 
            .populate('doneBy', 'username') 
            .populate('skills.skill', 'skillname')
        res.status(200).send(assessments)
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})

// Create a new assessment
router.post('/', async (req, res) => {
    try {
        const insertedAssessment = await AssessmentModel.create(req.body)
        res.status(201).send(insertedAssessment)
    } 
    catch (err) {
        res.status(500).send({ error: err.message})
    }
})

// Get all assessments from a specific student
router.get('/student', async (req, res) => {
    try {
        const studentId = req.query.studentId
        if (!studentId) {
            return res.status(400).send({ error: 'Missing studentId parameter' })
        }
        const assessments = await AssessmentModel.find({ student: studentId })
            .populate('student', 'name')
            .populate('doneBy', 'username')
            .populate({path: 'skills.skill', select: 'skillName level'})
        if (assessments.length > 0) {
            res.send(assessments)
        } else {
            res.status(404).send({ error: 'No assessments found for the specified student' })
        }
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
})

// OLD METHOD OF FINDING A SPECIFIC STUDENTS ASSESSMENTS
// // find assessments from a specific student
// router.get('/student/:studentId', async (req, res) => {
//     try {
//         const assessments = await AssessmentModel.find({ student: req.params.studentId })
//             .populate('student', 'name')
//             .populate('doneBy', 'username')
//             .populate('skills.skill', 'skillName')
//         if (assessments.length > 0) {
//             res.send(assessments)
//         } else {
//             res.status(404).send({ error: 'No assessments found for the specified student' })
//         }
//     } catch (err) {
//         res.status(500).send({ error: err.message })
//     }
// })

// Get a specific assessment
router.get('/:id', async (req, res) => {
    try {
        const assessment = await AssessmentModel.findById(req.params.id)
            .populate('student', 'name') 
            .populate('doneBy', 'username') 
            .populate({path: 'skills.skill', select: 'skillName level'})
        if (assessment) {
            res.send(assessment)
        } else {
            res.status(404).send({ error: 'Student not found'})
        }
    }
    catch (err) {
        res.status(500).send({ error: err.message})
    } 
})

// Update an assessment
router.put('/:id', checkAdminMiddleware, async (req, res) => {
    try {
        const assessment = await AssessmentModel.findByIdAndUpdate(req.params.id, req.body, {new: true })
            .populate('student', 'name') 
            .populate('doneBy', 'username') 
            .populate({path: 'skills.skill', select: 'skillName level'})
        if (assessment) {
            assessment.save()
            res.send(assessment)
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