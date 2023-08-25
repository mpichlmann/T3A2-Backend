import { Router } from 'express'
import { StudentModel } from '../db.js'
import { checkAdminMiddleware } from './admin.js'

const router = Router()

// Get all students
router.get('/', async (req, res) => {
    try {
        const students = await StudentModel.find()
        res.status(200).send(students);
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
})

// Search for students 
router.get('/results', async (req, res) => {
    try {
        const searchName = req.query.search
        const students = await StudentModel.find({ name: { $regex: searchName, $options: 'i' } })
        res.status(200).send(students)
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
})

// Get a specific student
router.get('/:id', async (req, res) => {
    try {
        const student = await StudentModel.findById(req.params.id).populate()
        if (student) {
            res.status(200).send(student)
        } else {
            res.status(404).send({ error: 'Student not found'})
        }
    } catch (err) {
        res.status(500).send({ error: err.message })
    } 
})

// Create a new student
router.post('/', checkAdminMiddleware, async (req, res) => {
    try {
        const insertedStudent = await StudentModel.create(req.body)
        res.status(201).send(insertedStudent)
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
})

// Update a student
router.put('/:id', checkAdminMiddleware, async (req, res) => {
    try {
        const student = await StudentModel.findByIdAndUpdate(req.params.id, req.body, {new: true })
        if (student) {
            student.save()
            res.status(200).send(student)
        } else {
            res.status(404).send({ error: 'Student not found'})
    }
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
})

// Delete a student
router.delete('/:id', checkAdminMiddleware, async (req, res) => {
    try {
        const student = await StudentModel.findByIdAndDelete(req.params.id)
        if (student) {
            res.status(200).send({ message: 'Student deleted successfully' })
        } else {
            res.status(404).send({ error: 'Student not found' })
        }
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
})

export default router