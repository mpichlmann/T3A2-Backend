import express from 'express'
import { AssessmentModel, StudentModel } from './db.js'
import cors from 'cors'
import studentRoutes from './routes/student_routes.js'
import userRoutes from './routes/user_routes.js'

const app = express()

app.use(cors())

app.use(express.json())

app.get('/hello', (req, res) => res.send({ info: 'Tumble Skills! '}))

app.get('/assessments', async (req, res) => res.status(200).send(await AssessmentModel.find()))

app.use('/students', studentRoutes)

app.use('/users', userRoutes)

export default app