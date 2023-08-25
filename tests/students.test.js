import app from '../app.js'
import request from 'supertest'


describe("Students Testing", () => {
    test('GET /', async () => {
        const res = await request(app).get('/hello')
        expect(res.status).toBe(200)
        expect(res.header['content-type']).toMatch('json')
        expect(res.body.info).toBeDefined()
        expect(res.body.info).toBe('Tumble Skills!')
        
    })

    test('GET /students', async () => {
        const res = await request(app).get('/students')
        expect(res.status).toBe(200)
        expect(res.header['content-type']).toMatch('json')
        expect(res.body).toBeInstanceOf(Array)
        
    })

    test('Each student has a valid "name" and "skillLevel"', async () => {
        const response = await request(app).get('/students')
        const students = response.body
        students.forEach(student => {
            expect(student.name).toBeDefined()
            expect(typeof student.name).toBe('string')
            expect(student.skillLevel).toBeDefined()
            expect(typeof student.skillLevel).toBe('number')
            expect(student.skillLevel).toBeGreaterThanOrEqual(1)
            expect(student.skillLevel).toBeLessThanOrEqual(6)
        })
    })
})






