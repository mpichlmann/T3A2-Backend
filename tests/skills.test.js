import app from '../app.js'
import request from 'supertest'
import { SkillModel } from '../db.js'

describe("Skills Testing", () => {
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
        expect(response.status).toBe(200)
        expect(response.body.skillName).toBe('test skill')

        //cleanup 
        await SkillModel.findByIdAndDelete(testSkill._id)
    })

    test('attempt to get a skill that does not exist', async () => {
        const response = await request(app)
        .get('/skills/64e831eec71a4eeffa97bdcd')

        // Assertions
        expect(response.status).toBe(404)
        expect(response.body.error).toBe('Skill not found')
    })

    test('attempt to get a non skill object', async () => {
        const errorThrowingString = 'thisIsntEvenAnId'

        const response = await request(app)
        .get(`/skills/${errorThrowingString}`)

        // Assertions
        expect(response.status).toBe(500)
        expect(response.body.error).toBe("Cast to ObjectId failed for value \"thisIsntEvenAnId\" (type string) at path \"_id\" for model \"Skill\"")
    })

    test('get all skills of a specific level', async () => {
        const response = await request(app)
        .get('/skills/level/1')

        // Assertions
        expect(response.status).toBe(200)
        expect(response.body).toBeInstanceOf(Array)
    })

    test('get all skills of a specific level that does not exist', async () => {
        const response = await request(app)
        .get('/skills/level/10')

        // Assertions
        expect(response.status).toBe(404)
        expect(response.body.error).toBe('No skills found for the specified level')
    })

    test('get all skills with a parameter that isnt a skill level', async () => {
        const response = await request(app)
        .get('/skills/level/badparameter')

        // Assertions
        expect(response.status).toBe(500)
        expect(response.body.error).toBe("Cast to Number failed for value \"badparameter\" (type string) at path \"level\" for model \"Skill\"")
    })
})