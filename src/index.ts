import express, { type Application } from 'express'
import { routes } from './routes'
import { logger } from './utils/logger'
import bodyParser from 'body-parser'
import cors from 'cors'

// Connect to MongoDB
import './utils/connectDB'

// Import deserializeToken
import deserializeToken from './middleware/deserializeToken'

const app: Application = express()
const port: number = 4000

// Parse request body
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// CORS access handler
app.use(cors())
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', '*')
  res.setHeader('Access-Control-Allow-Headers', '*')
  next()
})

// Use deserializeToken
app.use(deserializeToken)

// Routing
routes(app)

// Init app
app.listen(port, () => logger.info(`Server is listening on port ${port}`))
