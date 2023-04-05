import express, { Application, Request, Response, NextFunction } from 'express'

const app: Application = express()
const port: Number = 4000

// Routing
app.use('/help', (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send({ status: '200' })
})

// Init app
app.listen(port, () => console.log(`Server is listening on port ${port}`))
