import app from  '../app.js'
import request from 'supertest'
import { UserModel } from '../db.js'

describe("Users Testing", () => {
    
    test('Search for users', async () => {
        const response = await request(app).get('/users/results?search=a')

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

        const response = await request(app).get(`/users/${testUser._id}`)

        expect(response.status).toBe(200)
        expect(response.body.username).toBe('testUser')

        await UserModel.findByIdAndDelete(testUser._id)
    })

    test('Attempt to get a user that does not exist', async () => {
        const response = await request(app)
        .get('/users/64e831eec71a4eeffa97bdcd')

        expect(response.status).toBe(404)
        expect(response.body.error).toBe('User not found')
    })

    test('attempt to get a non user object', async () => {
        const errorThrowingString = 'thisIsntEvenAnId'

        const response = await request(app)
        .get(`/users/${errorThrowingString}`)

        expect(response.status).toBe(500)
        expect(response.body.error).toBe("Cast to ObjectId failed for value \"thisIsntEvenAnId\" (type string) at path \"_id\" for model \"User\"")
    })

})