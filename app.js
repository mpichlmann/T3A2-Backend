import express, { response } from 'express'
import cors from 'cors'

const students = [
    {name: 'Lachie', id: 1, assessments: [1]}, 
    {name: 'Argine', id: 2, assessments: [2]}, 
    {name: 'Max', id: 3, assessments: [3]}
]

const users = []

const skills = []

const assessments = []

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