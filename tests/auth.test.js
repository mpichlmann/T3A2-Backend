import app from '../app.js'
import request from 'supertest'
import { UserModel, StudentModel } from '../db.js'
import bcrypt from 'bcrypt'

const saltRounds = 10
let accessToken

describe('Login Route', () => {
    test('Login with valid credentials', async () => {
        // Create a test user
        const hashedPassword = await bcrypt.hash('testpassword', saltRounds)
        const testUser = await UserModel.create({
            username: 'testadmin',
            password: hashedPassword, 
            name: 'Test Admin',
            isAdmin: true,
        });
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
    });
});

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
        

        // Clean up
        await StudentModel.findByIdAndDelete(response.body._id)
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
    });

    test('Attempt to delete a non student object', async () => {
        const errorThrowingString = 'thisIsntEvenAnId'

        const response = await request(app)
            .delete(`/students/${errorThrowingString}`)
            .set({ Authorization: accessToken })

        // Assertions
        expect(response.status).toBe(500)
        expect(response.body.error).toBe("Cast to ObjectId failed for value \"thisIsntEvenAnId\" (type string) at path \"_id\" for model \"Student\"")
    })

    
})