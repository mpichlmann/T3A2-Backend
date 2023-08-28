import app from '../app.js'
import request from 'supertest'
import { AssessmentModel, StudentModel, SkillModel, UserModel } from '../db.js'
import bcrypt from 'bcrypt'
const saltRounds = 10

let nonAdminToken
let testCoach

describe('Logging in as a non admin', () => {
test('Login with valid credentials as a non admin', async () => {
        // Create a test user
        const hashedPassword = await bcrypt.hash('testpassword', saltRounds)
        testCoach = await UserModel.create({
            username: 'testcoach',
            password: hashedPassword, 
            name: 'Test Admin',
            isAdmin: false,
        })
        const response = await request(app)
            .post('/login')
            .send({ username: 'testcoach', password: 'testpassword' })

        // Assertions
        expect(response.status).toBe(200)
        expect(response.body.user.username).toBe('testcoach')
        expect(response.body.accessToken).toBeDefined()
        nonAdminToken = response.body.accessToken
    })
})

describe('Assessments testing', () => {
    test('Get all Assessments', async () => {
        const res = await request(app).get('/assessments').set({Authorization: nonAdminToken})

        // Assertions
        expect(res.status).toBe(200)
        expect(res.header['content-type']).toMatch('json')
        expect(res.body).toBeInstanceOf(Array)
    })

    test('Get assessments from a specific student', async () => {

        // Create test data
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
        .get(`/assessments/student/${testSpecificStudent._id}`).set({Authorization: nonAdminToken})

        // Assertions
        expect(response.status).toBe(200)
        expect(response.body[0].student._id).toBe(testSpecificStudent._id.toString())
        expect(response.body[0].doneBy._id).toBe(testSpecificUser._id.toString())

        // Clean up
        await AssessmentModel.findByIdAndDelete(testSpecificAssessment._id)
        await StudentModel.findByIdAndDelete(testSpecificStudent._id)
        await SkillModel.findByIdAndDelete(testSpecificSkill._id)
        await UserModel.findByIdAndDelete(testSpecificUser._id)
    })


    test('Get a specific assessment', async () => {

        // Create test data
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
        .get(`/assessments/${testSpecificAssessment._id}`).set({Authorization: nonAdminToken})

        // Assertions
        expect(response.status).toBe(200)
        expect(response.body.doneBy._id).toBe(testSpecificUser._id.toString())
        expect(response.body.student._id).toBe(testSpecificStudent._id.toString())

        // Clean up
        await AssessmentModel.findByIdAndDelete(testSpecificAssessment._id)
        await StudentModel.findByIdAndDelete(testSpecificStudent._id)
        await SkillModel.findByIdAndDelete(testSpecificSkill._id)
        await UserModel.findByIdAndDelete(testSpecificUser._id)
        await UserModel.findByIdAndDelete(testCoach._id)
    })
})

