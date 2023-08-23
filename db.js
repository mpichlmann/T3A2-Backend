import mongoose from 'mongoose'
dotenv.config()
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'

async function dbClose() {
    await mongoose.connection.close()
    console.log('db closed')}

mongoose.connect(process.env.ATLAS_DB_URL)
    .then(m => console.log(m.connection.readyState === 1 ? 'Mongoose connected!' : 'Mongoose failed'))
    .catch(err => console.error(err))

// STUDENT SCHEMA/MODEL
const studentSchema = new mongoose.Schema({
    name: {type: String, required: true},
    DOB: {type: Date, required: true},
    skillLevel: {type: Number, min: 1, max: 6, required: true}
})
const StudentModel = mongoose.model('Student', studentSchema)

// USER SCHEMA/MODEL 
const userSchema = new mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    name: {type: String, required: true},
    isAdmin: {type: Boolean, required: true}
})
    userSchema.methods.comparePassword = async function(candidatePassword) {
        return bcrypt.compare(candidatePassword, this.password)
    }
const UserModel = mongoose.model('User', userSchema)

// SKILL SCHEMA/MODEL
const skillSchema = new mongoose.Schema({
    skillName: {type: String, required: true},
    level: {type: Number, min: 1, max: 6, required: true}
})
const SkillModel = mongoose.model('Skill', skillSchema)

// ASSESSMENT SCHEMA/MODEL
const assessmentSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    doneBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isCompleted: {type: Boolean, required: true},
    skills: [{ skill: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }, score: Number }]
})
const AssessmentModel = mongoose.model('Assessment', assessmentSchema)

export { StudentModel, UserModel, SkillModel, AssessmentModel, dbClose } 