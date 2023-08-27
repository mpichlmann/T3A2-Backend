import { Router } from 'express'
import { SkillModel } from '../db.js'
import { checkAdminMiddleware } from './admin.js'

const router = Router()

// Get all skills
router.get('/', async (req, res) => {
    try {
        const skills = await SkillModel.find()
        res.status(200).send(skills)
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
})

// Get a specific skill
router.get('/:id', async (req, res) => {
    try {
        const skill = await SkillModel.findById(req.params.id)
        if (skill) {
            res.status(200).send(skill)
        } else {
            res.status(404).send({ error: 'Skill not found'})
        }
    } catch (err) {
        res.status(500).send({ error: err.message} )
    } 
})

// Get all skills of a specific level
router.get('/level/:level', async (req, res) => {
    try {
        const skills = await SkillModel.find({ levels: { $in: [Number(req.params.level)]}})
        if (skills.length > 0) {
            res.status(200).send(skills)
        } else {
            res.status(404).send({ error: 'No skills found for the specified level' })
        }
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
})

// Create a new skill
router.post('/', checkAdminMiddleware, async (req, res) => {
    try {
        const insertedSkill = await SkillModel.create(req.body)
        res.status(201).send(insertedSkill)
    } catch (err) {
        res.status(500).send({ error: err.message} )
    }
})

// Update a skill
router.put('/:id', checkAdminMiddleware, async (req, res) => {
    try {
        const skill = await SkillModel.findByIdAndUpdate(req.params.id, req.body, {new: true })
        if (skill) {
            skill.save()
            res.status(200).send(skill)
        } else {
            res.status(404).send({ error: 'Skill not found'})
        }
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
}) 

// Delete a skill
router.delete('/:id', checkAdminMiddleware, async (req, res) => {
    try {
        const skill = await SkillModel.findByIdAndDelete(req.params.id)
        if (skill) {
            res.status(200).send({ message: 'Skill deleted successfully' })
        } else {
            res.status(404).send({ error: 'Skill not found' })
        }
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
})

export default router