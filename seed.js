import { StudentModel, UserModel, SkillModel, AssessmentModel, dbClose } from './db.js'
import bcrypt from 'bcrypt'
const saltRounds = 10

const seedData = async () => {
    try {
        // Delete all previous data
        await AssessmentModel.deleteMany()
        console.log('Deleted assessments')

        await StudentModel.deleteMany()
        console.log('Deleted students')

        await UserModel.deleteMany()
        console.log('Deleted users')

        await SkillModel.deleteMany()
        console.log('Deleted skills')
        
        // Skills data
        const skillslist = [
            { skillName: 'jump', level: 1 },
            { skillName: 'handstand', level: 2 },
            { skillName: 'somersault', level: 3 },
            { skillName: 'backflip', level: 4 },
            { skillName: 'double backflip', level: 4 },
            { skillName: 'roll on the floor', level: 1 },
            { skillName: 'cartwheel', level: 2 },
            { skillName: 'explode', level: 3 }
        ]
        const sk = await SkillModel.insertMany(skillslist)
        console.log('Skills seeded')
        
        // User data
        const users = [
            { 
            username: 'eliteadmin', 
            password: 'spameggs', 
            name: 'Adam Minister', 
            isAdmin: true 
            },
            { 
            username: 'elitecoach', 
            password: 'foobar', 
            name: 'Jay Son', 
            isAdmin: false 
            }
        ]
        const hashedUsers = await Promise.all(users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, saltRounds)
        return {
            ...user,
            password: hashedPassword
            }
        }))
        const us = await UserModel.insertMany(hashedUsers);
        console.log('Users seeded')
        
        // Student data
        const students = [
            { name: 'Lachie', DOB: new Date('1996-09-04'), skillLevel: 3 },
            { name: 'Argine', DOB: new Date('1994-01-01'), skillLevel: 6 },
            { name: 'Max', DOB: new Date('1996-07-04'), skillLevel: 1 },
            { name: 'Mushu', DOB: new Date('1996-09-04'), skillLevel: 3 },
            { name: 'Clyde', DOB: new Date('1994-01-01'), skillLevel: 6 },
            { name: 'Mr Dingus', DOB: new Date('1996-07-04'), skillLevel: 1 },
            { name: 'Phil', DOB: new Date('1996-09-04'), skillLevel: 3 },
            { name: 'Guido', DOB: new Date('1994-01-01'), skillLevel: 6 },
            { name: 'Barbie', DOB: new Date('1996-07-04'), skillLevel: 1 },
            { name: 'Britta', DOB: new Date('1996-09-04'), skillLevel: 3 },
            { name: 'Luffy', DOB: new Date('1994-01-01'), skillLevel: 6 },
            { name: 'Shirley', DOB: new Date('1996-07-04'), skillLevel: 1 },
        ]
        const st = await StudentModel.insertMany(students);
        console.log('Students seeded');

        // Assessment Data
        const assessments = [
            {
                student: st.find(student => student.name === 'Lachie')._id,
                doneBy: (await UserModel.findOne({ username: 'elitecoach' }))._id,
                isCompleted: true,
                skills: [
                    { skill: (await SkillModel.findOne({ skillName: 'jump' }))._id, score: 1 },
                    { skill: (await SkillModel.findOne({ skillName: 'handstand' }))._id, score: 2 }
                ]
            },
            {
                student: st.find(student => student.name === 'Argine')._id,
                doneBy: (await UserModel.findOne({ username: 'elitecoach' }))._id,
                isCompleted: true,
                skills: [
                    { skill: (await SkillModel.findOne({ skillName: 'somersault' }))._id, score: 4 },
                    { skill: (await SkillModel.findOne({ skillName: 'backflip' }))._id, score: 3 }
                ]
            },
            {
                student: st.find(student => student.name === 'Max')._id,
                doneBy: (await UserModel.findOne({ username: 'elitecoach' }))._id,
                isCompleted: true,
                skills: [
                    { skill: (await SkillModel.findOne({ skillName: 'jump' }))._id, score: 1 },
                    { skill: (await SkillModel.findOne({ skillName: 'backflip' }))._id, score: 1 }
                ]
            },
            {
                student: st.find(student => student.name === 'Lachie')._id,
                doneBy: (await UserModel.findOne({ username: 'elitecoach' }))._id,
                isCompleted: true,
                skills: [
                    { skill: (await SkillModel.findOne({ skillName: 'backflip' }))._id, score: 3 },
                    { skill: (await SkillModel.findOne({ skillName: 'somersault' }))._id, score: 4 }
                ]
            },
            {
                student: st.find(student => student.name === 'Argine')._id,
                doneBy: (await UserModel.findOne({ username: 'elitecoach' }))._id,
                isCompleted: true,
                skills: [
                    { skill: (await SkillModel.findOne({ skillName: 'jump' }))._id, score: 3 },
                    { skill: (await SkillModel.findOne({ skillName: 'handstand' }))._id, score: 3 }
                ]
            },
            {
                student: st.find(student => student.name === 'Max')._id,
                doneBy: (await UserModel.findOne({ username: 'elitecoach' }))._id,
                isCompleted: true,
                skills: [
                    { skill: (await SkillModel.findOne({ skillName: 'handstand' }))._id, score: 2 },
                    { skill: (await SkillModel.findOne({ skillName: 'backflip' }))._id, score: 2 }
                ]
            }
        ]
        const as = await AssessmentModel.insertMany(assessments)
        console.log('Assessments seeded')
    } catch (error) {
        console.error(error)
    } finally {
        dbClose()
    }
}

seedData()
