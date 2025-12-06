import express, { Request, Response } from "express"
const app = express()


app.get('/', (req: Request, res: Response) => {
    res.send('gariVara server is running')
})



export default app