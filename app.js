import express from 'express'
import { AssessmentModel, StudentModel } from './db.js'
import cors from 'cors'
import studentRoutes from './routes/student_routes.js'
import userRoutes from './routes/user_routes.js'
import authRoutes from './routes/auth.js'
import assessmentRoutes from './routes/assessment_routes.js'
import skillRoutes from './routes/skill_routes.js'

const app = express()

app.use(cors())

app.use(express.json())

app.get('/hello', (req, res) => res.send({ info: 'Tumble Skills!' }))

app.use('/assessments', assessmentRoutes)

app.use('/skills', skillRoutes)

app.use('/students', studentRoutes)

app.use('/users', userRoutes)

app.use('/login', authRoutes)

export default app