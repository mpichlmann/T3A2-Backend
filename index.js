import express, { response } from 'express'

const app = express()
const port = 4001

app.get('/', (req, res) => res.send({ info: 'Tumble Skills! '}))

app.listen(port)


