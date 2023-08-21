import mongoose from 'mongoose'
import dotenv from 'dotenv'

mongoose.connect('mongodb+srv://tumbleadmin:hs8TRClUyVbQDILG@tumbletracker.jdvxsli.mongodb.net/tumbletracker?retryWrites=true&w=majority')
    .then(m => console.log(m.connection.readyState === 1 ? 'Mongoose connected!' : 'Mongoose failed'))
    .catch(err => console.error(err))

const studentSchema = new mongoose.Schema({
    name: {type: String, required: true},
    assessments: {type: Array}
})
const StudentModel = mongoose.model('Student', studentSchema)

const userSchema = new mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    name: {type: String, required: true},
    isAdmin: {type: Boolean, required: true}
})
const UserModel = mongoose.model('User', userSchema)

const skillSchema = new mongoose.Schema({
    skillname: {type: String, required: true},
    level: {type: Number, min: 1, max: 6, required: true}
})
const SkillModel = mongoose.model('Skill', skillSchema)

const assessmentSchema = new mongoose.Schema({
    student: {type: String, required: true},
    doneBy: {type: String, required: true},
    isCompleted: {type: Boolean, required: true},
    skills: {type: Array, required: true}
})
const AssessmentModel = mongoose.model('Assessment', assessmentSchema)

export { StudentModel, UserModel, SkillModel, AssessmentModel } 