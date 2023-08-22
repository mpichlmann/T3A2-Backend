import { StudentModel, UserModel, SkillModel, AssessmentModel, dbClose } from './db.js'

const seedData = async () => {
    try {
        await AssessmentModel.deleteMany()
        console.log('Deleted assessments')

        await StudentModel.deleteMany()
        console.log('Deleted students')

        await UserModel.deleteMany()
        console.log('Deleted users')

        await SkillModel.deleteMany()
        console.log('Deleted skills')

        const skillslist = [
            { skillname: 'jump', level: 1 },
            { skillname: 'handstand', level: 2 },
            { skillname: 'somersault', level: 3 },
            { skillname: 'backflip', level: 4 }
        ];
        const sk = await SkillModel.insertMany(skillslist)
        console.log('Skills seeded')

        const users = [
            { username: 'eliteadmin', password: 'spameggs', name: 'Adam Minister', isAdmin: true },
            { username: 'elitecoach', password: 'foobar', name: 'Jay Son', isAdmin: false }
        ];
        const us = await UserModel.insertMany(users)
        console.log('Users seeded')

        

        const students = [
            { name: 'Lachie', assessments: [] }, 
            { name: 'Argine', assessments: [] },
            { name: 'Arginelolol', assessments: [] },
            { name: 'Arginetor', assessments: [] },
            { name: 'ArgineArgzzz', assessments: [] },
            { name: 'ArgineDaCoder', assessments: [] }, 
            { name: 'Max', assessments: [] } 
        ];
        const st = await StudentModel.insertMany(students)
        console.log('Students seeded')
    } catch (error) {
        console.error(error)
    } finally {
        dbClose()
    }
}

seedData()