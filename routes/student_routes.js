import { Router } from 'express'
import { StudentModel } from '../db.js'
import { checkAdminMiddleware } from './admin.js'

const router = Router()

router.get('/', async (req, res) => res.status(200).send(await StudentModel.find()))

router.get('/:id', async (req, res) => {
    try {
        const student = await StudentModel.findById(req.params.id).populate()
        if (student) {
            res.send(student)
        } else {
            res.status(404).send({ error: 'Student not found'})
        }
    }
    catch (err) {
        res.status(500).send({ error: err.message })
    } 
})

router.post('/', async (req, res) => {
    try {
        const insertedStudent = await StudentModel.create(req.body)
        res.status(201).send(insertedStudent)
    } 
    catch (err) {
        res.status(500).send({ error: err.message })
    }
})

router.put('/:id', checkAdminMiddleware, async (req, res) => {
    try {
        const student = await StudentModel.findByIdAndUpdate(req.params.id, req.body, {new: true })
        if (student) {
            student.save()
            res.send(student)
        } else {
            res.status(404).send({ error: 'Student not found'})
    }
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
})

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


// Search for students 

router.get('/search/:name', async (req, res) => {
    try {
        const searchName = req.params.name

        const students = await StudentModel.find({ name: { $regex: searchName, $options: 'i' } })

        res.status(200).send(students)
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})


export default router