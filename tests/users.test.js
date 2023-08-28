import app from  '../app.js'
import request from 'supertest'
import { UserModel } from '../db.js'

let accessToken

describe('Simulate a login', () => {
    test('Login as elite admin', async () => {
        const response = await request(app)
            .post('/login')
            .send({ username: 'eliteadmin', password: 'spameggs' })

        // Assertions
        expect(response.status).toBe(200)
        expect(response.body.user.username).toBe('eliteadmin')
        expect(response.body.accessToken).toBeDefined()
        accessToken = response.body.accessToken
        
        // Clean up by removing the test user
        
    })
})


describe("Users Testing", () => {
    test('Search for users', async () => {
        const response = await request(app).get('/users/results?search=a').set({Authorization: accessToken})

        // Assertions
        expect(response.status).toBe(200)
        expect(response.header['content-type']).toMatch('json')
        expect(response.body).toBeInstanceOf(Array)
    })

    test('Get a specific user', async () => {
        const testUser = await UserModel.create({
            username: 'testUser',
            password: 'testPassword',
            name: 'Testy McUserson',
            isAdmin: false
        })

        const response = await request(app).get(`/users/${testUser._id}`).set({Authorization: accessToken})

        // Assertions
        expect(response.status).toBe(200)
        expect(response.body.username).toBe('testUser')

        // Clean up
        await UserModel.findByIdAndDelete(testUser._id)
    })

    test('Attempt to get a user that does not exist', async () => {
        const response = await request(app)
        .get('/users/64e831eec71a4eeffa97bdcd').set({Authorization: accessToken})

        // Assertions
        expect(response.status).toBe(404)
        expect(response.body.error).toBe('User not found')
    })

    test('attempt to get a non user object', async () => {
        const errorThrowingString = 'thisIsntEvenAnId'

        const response = await request(app)
        .get(`/users/${errorThrowingString}`).set({Authorization: accessToken})

        // Assertions
        expect(response.status).toBe(500)
        expect(response.body.error).toBe("Cast to ObjectId failed for value \"thisIsntEvenAnId\" (type string) at path \"_id\" for model \"User\"")
    })
})