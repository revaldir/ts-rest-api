import express, { type Application, type Request, type Response, type NextFunction } from 'express'

const app: Application = express()
const port: number = 4000

// Routing
app.use('/help', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).send({ status: '200' })
})

// Init app
app.listen(port, () => console.log(`Server is listening on port ${port}`))
