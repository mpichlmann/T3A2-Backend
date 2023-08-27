import { StudentModel, UserModel, SkillModel, AssessmentModel,  } from './db.js'
import bcrypt from 'bcrypt'
import mongoose from 'mongoose'

const saltRounds = 10

async function dbClose() {
    await mongoose.connection.close()
    console.log('db closed')}

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
            // level 1 skills
            { skillName: 'Handstand', level: 0 },
            { skillName: 'Cartwheel', level: 0 },
            { skillName: 'Forward Roll', level: 0 },
            { skillName: 'Backward Roll to Stand', level: 0 },
            { skillName: 'Bridge', level: 0 },
            { skillName: 'Handstand Flat Back', level: 0 },
            { skillName: 'Round Off to Belly', level: 0 },
            // level 2 skills
            { skillName: 'Cartwheel', level: 1 },
            { skillName: 'Backward Roll to Stand', level: 1 },
            { skillName: 'Handstand Forward Roll', level: 1 },
            { skillName: 'Back Bend', level: 1 },
            { skillName: 'Kickover', level: 1 },
            { skillName: 'Back Walkover', level: 1 },
            { skillName: 'Handstand to Bridge', level: 1 },
            { skillName: 'Front Limber', level: 1 },
            { skillName: 'Front Walkover', level: 1 },
            { skillName: 'Pop Handstand', level: 1 },
            { skillName: 'Round Off', level: 1 },
            // level 3 skills
            { skillName: 'Backward Roll to Front Support', level: 2 },
            { skillName: 'Back Walkover', level: 2 },
            { skillName: 'Back Limber', level: 2 },
            { skillName: 'Front Walkover', level: 2 },
            { skillName: 'Handstand Forward Roll', level: 2 },
            { skillName: 'Round Off', level: 2 },
            { skillName: 'Punch Dive Roll', level: 2 },
            { skillName: 'Front Handspring', level: 2 },
            // level 4 skills
            { skillName: 'Punch Dive Roll', level: 3 },
            { skillName: 'Front Handspring', level: 3 },
            { skillName: 'Round Off Back Handspring', level: 3 },
            { skillName: 'Standing Back Handspring', level: 3 },
            { skillName: 'BWO to Standing Back Handspring', level: 3 },
            { skillName: 'Round Off Back Handspring Series', level: 3 },
            { skillName: 'Punch Front Tuck (Air Track to Landing Mat Option', level: 3 }
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
            { name: 'Mushu', DOB: new Date('1996-09-04'), skillLevel: 4 },
            { name: 'Clyde', DOB: new Date('1994-01-01'), skillLevel: 5 },
            { name: 'Mr Dingus', DOB: new Date('1996-07-04'), skillLevel: 0 },
            { name: 'Phil', DOB: new Date('1996-09-04'), skillLevel: 3 },
            { name: 'Guido', DOB: new Date('1994-01-01'), skillLevel: 4 },
            { name: 'Barbie', DOB: new Date('1996-07-04'), skillLevel: 6 },
            { name: 'Britta', DOB: new Date('1996-09-04'), skillLevel: 3 },
            { name: 'Luffy', DOB: new Date('1994-01-01'), skillLevel: 5 },
            { name: 'Shirley', DOB: new Date('1996-07-04'), skillLevel: 2 },
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
                    { skill: (await SkillModel.findOne({ skillName: 'Handstand' }))._id, score: 1 },
                    { skill: (await SkillModel.findOne({ skillName: 'Cartwheel' }))._id, score: 2 }
                ],
                Date: new Date('2022-01-01'),
            },
            {
                student: st.find(student => student.name === 'Argine')._id,
                doneBy: (await UserModel.findOne({ username: 'elitecoach' }))._id,
                isCompleted: true,
                skills: [
                    { skill: (await SkillModel.findOne({ skillName: 'Forward Roll' }))._id, score: 4 },
                    { skill: (await SkillModel.findOne({ skillName: 'Backward Roll to Stand' }))._id, score: 3 }
                ],
                Date: new Date('2022-02-03'),
            },
            {
                student: st.find(student => student.name === 'Max')._id,
                doneBy: (await UserModel.findOne({ username: 'elitecoach' }))._id,
                isCompleted: true,
                skills: [
                    { skill: (await SkillModel.findOne({ skillName: 'Bridge' }))._id, score: 1 },
                    { skill: (await SkillModel.findOne({ skillName: 'Handstand Flat Back' }))._id, score: 1 }
                ],
                Date: new Date('2021-01-10'),
            },
            {
                student: st.find(student => student.name === 'Lachie')._id,
                doneBy: (await UserModel.findOne({ username: 'elitecoach' }))._id,
                isCompleted: true,
                skills: [
                    { skill: (await SkillModel.findOne({ skillName: 'Cartwheel' }))._id, score: 3 },
                    { skill: (await SkillModel.findOne({ skillName: 'Backward Roll to Stand' }))._id, score: 4 }
                ],
                Date: new Date('2022-12-11'),
            },
            {
                student: st.find(student => student.name === 'Argine')._id,
                doneBy: (await UserModel.findOne({ username: 'elitecoach' }))._id,
                isCompleted: true,
                skills: [
                    { skill: (await SkillModel.findOne({ skillName: 'Handstand Forward Roll' }))._id, score: 3 },
                    { skill: (await SkillModel.findOne({ skillName: 'Back Bend' }))._id, score: 3 }
                ],
                Date: new Date('2022-05-13'),
            },
            {
                student: st.find(student => student.name === 'Max')._id,
                doneBy: (await UserModel.findOne({ username: 'elitecoach' }))._id,
                isCompleted: true,
                skills: [
                    { skill: (await SkillModel.findOne({ skillName: 'Kickover' }))._id, score: 2 },
                    { skill: (await SkillModel.findOne({ skillName: 'Back Walkover' }))._id, score: 2 }
                ],
                Date: new Date('2022-10-03'),
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
