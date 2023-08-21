import { StudentModel, UserModel, SkillModel, AssessmentModel, dbClose } from './db.js'

const assessments = [
    {student: 'Lachie', doneBy: 'elitecoach', isCompleted: true, skills: [{skillname: 'jump', score: 1}, {skillname: 'handstand', score: 2}]},
    {student: 'Argine', doneBy: 'elitecoach', isCompleted: true, skills: [{skillname: 'somersault', score: 4}, {skillname: 'backflip', score: 3}]},
    {student: 'Max', doneBy: 'elitecoach', isCompleted: true, skills: [{skillsname: 'jump', score: 1}, {skillname: 'backflip', score: 1}]},
]
await AssessmentModel.deleteMany()
console.log('deleted assessments')
const as = await AssessmentModel.insertMany(assessments)
console.log('assessments seeded')


const students = [
    {name: 'Lachie', assessments: assessments[0]}, 
    {name: 'Argine', assessments: assessments[1]}, 
    {name: 'Max', assessments: assessments[2]}, 
]

await StudentModel.deleteMany()
console.log('deleted categories')
const st = await StudentModel.insertMany(students)
console.log('students seeded')

const users = [
    {username: 'eliteadmin', password: 'spameggs', name: 'Adam Minister', isAdmin: true},
    {username: 'elitecoach', password: 'foobar', name: 'Jay Son', isAdmin: false}
]
await UserModel.deleteMany()
console.log('deleted users')
const us = await UserModel.insertMany(users)
console.log('users seeded')

const skillslist = [
    {skillname: 'jump', level: 1},
    {skillname: 'handstand', level: 2},
    {skillname: 'somersault', level: 3},
    {skillname: 'backflip', level: 4},
]
await SkillModel.deleteMany()
console.log('deleted skills')
const sk = await SkillModel.insertMany(skillslist)
console.log('skills seeded')



dbClose()