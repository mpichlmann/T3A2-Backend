import app from '../app.js'
import request from 'supertest'
import { UserModel } from '../db.js'
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

describe("Students Testing", () => {
    test('GET /', async () => {
        const res = await request(app).get('/hello').set({Authorization: nonAdminToken})

        // Assertions
        expect(res.status).toBe(200)
        expect(res.header['content-type']).toMatch('json')
        expect(res.body.info).toBeDefined()
        expect(res.body.info).toBe('Tumble Skills!')
        
    })

    test('GET /students', async () => {
        const res = await request(app).get('/students').set({Authorization: nonAdminToken})

        // Assertions
        expect(res.status).toBe(200)
        expect(res.header['content-type']).toMatch('json')
        expect(res.body).toBeInstanceOf(Array)
        
    })

    test('Each student has a valid "name" and "skillLevel"', async () => {
        const response = await request(app).get('/students').set({Authorization: nonAdminToken})

        // Assertions
        const students = response.body
        students.forEach(student => {
            expect(student.name).toBeDefined()
            expect(typeof student.name).toBe('string')
            expect(student.skillLevel).toBeDefined()
            expect(typeof student.skillLevel).toBe('number')
            expect(student.skillLevel).toBeGreaterThanOrEqual(0)
            expect(student.skillLevel).toBeLessThanOrEqual(6)
        })

        // Clean up
        await UserModel.findByIdAndDelete(testCoach._id)
    })
})






