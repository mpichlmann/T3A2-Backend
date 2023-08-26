import app from '../app.js'
import request from 'supertest'
import { AssessmentModel, StudentModel, SkillModel, UserModel } from '../db.js'

describe('Assessments testing', () => {
    test('Get all Assessments', async () => {
        const res = await request(app).get('/assessments')
        expect(res.status).toBe(200)
        expect(res.header['content-type']).toMatch('json')
        expect(res.body).toBeInstanceOf(Array)
    })

    test('Get assessments from a specific student', async () => {

        const testSpecificStudent = await StudentModel.create({
            name: 'Test Student', 
            DOB: '1991-01-01',
            skillLevel: 1
        })

        const testSpecificSkill = await SkillModel.create({
            skillName: 'test skill for assessment',
            level: 1
        })

        const testSpecificUser = await UserModel.create({
            username: 'test user',
            password: 'test password',
            name: 'Terry Ustilo',
            isAdmin: false
        })

        const testSpecificAssessment = await AssessmentModel.create({
            student: testSpecificStudent._id,
            doneBy: testSpecificUser._id,
            isCompleted: true,
            Date: new Date(), 
            skills: [
                {
                    skill: testSpecificSkill._id,
                    score: 4
                }
            ] 
        })

        const response = await request(app)
        .get(`/assessments/student/${testSpecificStudent._id}`)
        expect(response.status).toBe(200)
        expect(response.body[0].student._id).toBe(testSpecificStudent._id.toString())
        expect(response.body[0].doneBy._id).toBe(testSpecificUser._id.toString())


        await AssessmentModel.findByIdAndDelete(testSpecificAssessment._id)
        await StudentModel.findByIdAndDelete(testSpecificStudent._id)
        await SkillModel.findByIdAndDelete(testSpecificSkill._id)
        await UserModel.findByIdAndDelete(testSpecificUser._id)
    })


    test('Get a specific assessment', async () => {

        const testSpecificStudent = await StudentModel.create({
            name: 'Test Student', 
            DOB: '1991-01-01',
            skillLevel: 1
        })

        const testSpecificSkill = await SkillModel.create({
            skillName: 'test skill for assessment',
            level: 1
        })

        const testSpecificUser = await UserModel.create({
            username: 'test user',
            password: 'test password',
            name: 'Terry Ustilo',
            isAdmin: false
        })

        const testSpecificAssessment = await AssessmentModel.create({
            student: testSpecificStudent._id,
            doneBy: testSpecificUser._id,
            isCompleted: true,
            Date: new Date(), 
            skills: [
                {
                    skill: testSpecificSkill._id,
                    score: 4
                }
            ] 
        })

        const response = await request(app)
        .get(`/assessments/${testSpecificAssessment._id}`)

        expect(response.status).toBe(200)

        await AssessmentModel.findByIdAndDelete(testSpecificAssessment._id)
        await StudentModel.findByIdAndDelete(testSpecificStudent._id)
        await SkillModel.findByIdAndDelete(testSpecificSkill._id)
        await UserModel.findByIdAndDelete(testSpecificUser._id)
    })
})

