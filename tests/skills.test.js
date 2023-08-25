import app from '../app.js'
import request from 'supertest'
import { SkillModel } from '../db.js'

describe("Students Testing", () => {

    test('Get all skills', async () => {
        const res = await request(app).get('/skills')
        expect(res.status).toBe(200)
        expect(res.header['content-type']).toMatch('json')
        expect(res.body).toBeInstanceOf(Array)
        
    })

    test('get a specific skill', async () => {
        const testSkill = await SkillModel.create({
            skillName: 'test skill',
            level: 4
        })

        const response = await request(app).get(`/skills/${testSkill._id}`)

        // Assertions
        expect(response.status).toBe(200);
        expect(response.body.skillName).toBe('test skill')
    })



})