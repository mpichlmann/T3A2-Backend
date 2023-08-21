import { Router } from 'express'
import { StudentModel } from '../db.js'

const router = Router()

router.get('/', async (req, res) => res.status(200).send(await StudentModel.find()))

router.get('/:id', async (req, res) => {
    try {
        const student = await StudentModel.findById(req.params.id)
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

router.put('/:id', async (req, res) => {
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

router.delete('/:id', async (req, res) => {
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