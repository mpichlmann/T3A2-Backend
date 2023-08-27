import app from '../app.js'
import request from 'supertest'
import { UserModel, StudentModel, SkillModel, AssessmentModel } from '../db.js'
import bcrypt from 'bcrypt'

const saltRounds = 10
let accessToken
let errorThrowingString

describe('Login Route', () => {
    test('Login with valid credentials', async () => {
        // Create a test user
        const hashedPassword = await bcrypt.hash('testpassword', saltRounds)
        const testUser = await UserModel.create({
            username: 'testadmin',
            password: hashedPassword, 
            name: 'Test Admin',
            isAdmin: true,
        })
        const response = await request(app)
            .post('/login')
            .send({ username: 'testadmin', password: 'testpassword' })

        // Assertions
        expect(response.status).toBe(200)
        expect(response.body.user.username).toBe('testadmin')
        expect(response.body.accessToken).toBeDefined()
        accessToken = response.body.accessToken
        
        // Clean up by removing the test user
        await UserModel.findByIdAndDelete(testUser._id)
    })

    test('Login with invalid credentials', async () => {
        const response = await request(app)
            .post('/login')
            .send({ username: 'testadmin', password: 'wrongpassword' })

        // Assertions
        expect(response.status).toBe(401)
        expect(response.body.message).toBe('Invalid username or password')
    })
})

describe('Get a list of users', () => {
    test('GET /', async () => {
        const res = await request(app).get('/users').set({Authorization: accessToken})
        // Assertion
        expect(res.status).toBe(200)
        expect(res.header['content-type']).toMatch('json')
        expect(res.body).toBeInstanceOf(Array)

    }) 
})

describe('Auth protected student routes', () => {
    test('Create a new student', async () => {
        const response = await request(app)
        .post('/students')
        .send({
            name: 'Test Student', 
            DOB: '1991-01-01',
            skillLevel: 1
        })
        .set({Authorization: accessToken})

        // Assertions
        expect(response.status).toBe(201)
        expect(typeof response.body.name).toBe('string')
        expect(response.body.name).toBe('Test Student')
        
        // Clean up
        await StudentModel.findByIdAndDelete(response.body._id)
    })

    test('Create a new student with missing data', async () => {
        const response = await request(app)
        .post('/students')
        .send({
            name: 'Test Student', 
            skillLevel: 1
        })
        .set({Authorization: accessToken})

        // Assertions
        expect(response.status).toBe(500)
        expect(response.body.error).toBe("Student validation failed: DOB: Path `DOB` is required.")
    })

    test('delete a student successfully', async () => {
        const testStudent = await StudentModel.create({
            name: 'Test Student', 
            DOB: '1991-01-01',
            skillLevel: 1
        })
        
        const response = await request(app)
        .delete(`/students/${testStudent._id}`)
        .set({Authorization: accessToken})

        // Assertions
        expect(response.status).toBe(200)
        expect(response.body.message).toBe('Student deleted successfully')
    })

    test('Attempt to delete a non-existent student', async () => {
        const response = await request(app)
            .delete('/students/64e831eec71a4eeffa97bdcd')
            .set({ Authorization: accessToken })

        // Assertions
        expect(response.status).toBe(404)
        expect(response.body.error).toBe('Student not found')
    })

    test('Attempt to delete a non student object', async () => {
        errorThrowingString = 'thisIsntEvenAnId'

        const response = await request(app)
            .delete(`/students/${errorThrowingString}`)
            .set({ Authorization: accessToken })

        // Assertions
        expect(response.status).toBe(500)
        expect(response.body.error).toBe("Cast to ObjectId failed for value \"thisIsntEvenAnId\" (type string) at path \"_id\" for model \"Student\"")
    })
})

describe('Auth protected skills routes', () =>{
    test('Create a new skill', async () => {
        const response = await request(app)
        .post('/skills')
        .send({
            skillName: 'Test skill', 
            level: 4
        })
        .set({Authorization: accessToken})

        // Assertions
        expect(response.status).toBe(201)
        expect(response.body.skillName).toBe('Test skill')

        // Clean up
        await SkillModel.findByIdAndDelete(response.body._id)
    })

    test('Create a new skill with missing data', async () => {
        const response = await request(app)
        .post('/skills')
        .send({
            skillName: 'test skill'
        })
        .set({Authorization: accessToken})

        // Assertions
        expect(response.status).toBe(500)
        expect(response.body.error).toBe("Skill validation failed: level: Path `level` is required.")
    })

    test('Update a skill that does not exist', async () => {
        const response = await request(app)
        .put('/skills/64e831eec71a4eeffa97bdcd')
        .send({
            skillName: 'updatedSkill'
        })
        .set({Authorization: accessToken})

        // Assertions
        expect(response.status).toBe(404)
        expect(response.body.error).toBe('Skill not found')
    })

    test('Update a skill that is not a valid skill object', async () => {
        const response = await request(app)
        .put(`/skills/${errorThrowingString}`)
        .send({
            skillName: 'updatedSkill'
        })
        .set({Authorization: accessToken})

        // Assertions
        expect(response.status).toBe(500)
        expect(response.body.error).toBe("Cast to ObjectId failed for value \"thisIsntEvenAnId\" (type string) at path \"_id\" for model \"Skill\"")
    })

    test('Delete a skill', async () => {
        const testDeleteSkill = await SkillModel.create({
            skillName: 'testSkill',
            level: 4
        })

        const response = await request(app)
        .delete(`/skills/${testDeleteSkill._id}`)
        .set({Authorization: accessToken})

        // Assertions
        expect(response.status).toBe(200)
    })

    test('Delete a skill that does not exist', async () => {
        const response = await request(app)
        .delete('/skills/64e831eec71a4eeffa97bdcd')
        .set({Authorization: accessToken})

        // Assertions
        expect(response.status).toBe(404)
        expect(response.body.error).toBe('Skill not found')
    })

    test('Delete a non skill object', async () => {
        const errorThrowingString = 'thisIsntEvenAnId'

        const response = await request(app)
        .delete(`/skills/${errorThrowingString}`)
        .set({Authorization: accessToken})

        // Assertions
        expect(response.status).toBe(500)
        expect(response.body.error).toBe("Cast to ObjectId failed for value \"thisIsntEvenAnId\" (type string) at path \"_id\" for model \"Skill\"")
    })
})

describe('Auth protected user routes', () => {
    test('Delete a user', async () => {
        const testDeleteUser = await UserModel.create({
            username: 'testUser',
            password: 'testPassword',
            name: 'Testy McUserson',
            isAdmin: false
        })

        const response = await request(app)
        .delete(`/users/${testDeleteUser._id}`)
        .set({Authorization: accessToken})

        // Assertions
        expect(response.status).toBe(200)
    })

    test('Delete a user that does not exist', async () => {
        const response = await request(app)
        .delete('/users/64e831eec71a4eeffa97bdcd')
        .set({Authorization: accessToken})

        // Assertions
        expect(response.status).toBe(404)
        expect(response.body.error).toBe('User not found')
    })
})

describe('Auth protected assessment routes', () => {
    test('Create a new assessment', async () => {
        const testAssessmentStudent = await StudentModel.create({
            name: 'Test Student', 
            DOB: '1991-01-01',
            skillLevel: 1
        })

        const testAssessmentSkill = await SkillModel.create({
            skillName: 'test skill for assessment',
            level: 1
        })

        const response = await request(app)
        .post('/assessments')
        .send({
            student: testAssessmentStudent._id,
            isCompleted: true,
            skills: [
                {
                    skill: testAssessmentSkill._id,
                    score: 4

                }
            ]   
        })
        .set({Authorization: accessToken})
        let student = response.body.student
        let skill = response.body.skill

        // Assertions
        expect(response.status).toBe(201)
        expect(response.body.student).toBe(student)
        expect(response.body.skill).toBe(skill)
        expect(response.body.isCompleted).toBe(true)
        expect(response.header['content-type']).toMatch('json')

        // Clean up
        await AssessmentModel.findByIdAndDelete(response.body._id)
        await StudentModel.findByIdAndDelete(testAssessmentStudent._id)
        await SkillModel.findByIdAndDelete(testAssessmentSkill._id)
    })
})

