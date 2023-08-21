import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

const students = [
    {name: 'Lachie', assessments: [1]}, 
    {name: 'Argine', assessments: [2]}, 
    {name: 'Max', assessments: [3]}
]

const users = [
    {username: 'eliteadmin', password: 'spameggs', name: 'Adam Minister', isAdmin: true},
    {username: 'elitecoach', password: 'foobar', name: 'Jay Son', isAdmin: false}
]

const skills = [
    {skillname: 'jump', level: 1},
    {skillname: 'handstand', level: 2},
    {skillname: 'somersault', level: 3},
    {skillname: 'backflip', level: 4},
]

const assessments = [
    {student: 'Lachie', date: datetime.now(), doneBy: 'elitecoach', isComplete: true, skills: [{skillname: 'jump', score: 2}, {skillname: 'handstand', score: 2}]},
    {student: 'Argine', date: datetime.now(), doneBy: 'elitecoach', isComplete: true, skills: [{skillname: 'somersault', score: 4}, {skillname: 'backflip', score: 3}]},
]

mongoose.connect('mongodb+srv://tumbleadmin:hs8TRClUyVbQDILG@tumbletracker.jdvxsli.mongodb.net/?retryWrites=true&w=majority')
    .then(m => console.log(m.connection.readyState === 1 ? 'Mongoose connected!' : 'Mongoose failed'))
    .catch(err => console.error(err))

const studentsSchema = new mongoose.Schema({
    name: {type: String, required: true},
    assessments: {type: Array}
})

const StudentModel = mongoose.model('Student', studentsSchema)

const app = express()
const port = 4001

app.use(cors())

app.use(express.json())

app.get('/', (req, res) => res.send({ info: 'Tumble Skills! '}))

app.get('/students', (req, res) => res.status(200).send(students))

app.post('/students', (req, res) => {
    students.push(req.body)
    res.status(201).send(req.body)
})

app.get('/students/:id', (req, res) => {
    const student = students[req.params.id]
    if (student) {
        res.send(student)
    } else {
        res.status(404).send({ error: 'Entry not found'})
    }
})

app.listen(port)

export default app