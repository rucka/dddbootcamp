//import * as express from 'express'
import express, { Request, Response } from 'express'
import { createAdministratorService } from './administration'
import { Aircraft, SeatType } from './datalayer/contract'

export const live = () => {
  const administrator = createAdministratorService(false)

  const app = express()

  const port = 3000 //process.env.PORT

  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))

  app.get('/', (_: Request, res: Response) => {
    res.send('Hello, world!')
  })

  app.get('/aircrafts', async (_: Request, res: Response) => {
    return res.json(await administrator.getAircrafts())
  })

  app.post('/aircrafts', async (req: Request, res: Response) => {
    if (!req.body) {
      res.status(400).json({ message: 'Invalid request' })
    }
    const aircraft = req.body as Aircraft
    try {
      await administrator.upsertAircraft(aircraft)
      res.status(201).json(aircraft)
    } catch (err: any) {
      res.status(400).json({ message: err.message })
    }
  })

  app.get('/aircrafts/:model', async (req: Request, res: Response) => {
    const r = await administrator.getAircraft(req.params.model)
    if (!r) {
      return res.status(404).send('Not found')
    }
    return res.json(r)
  })

  app.delete('/aircrafts/:model', async (req: Request, res: Response) => {
    return res.json(await administrator.deleteAircraft(req.params.model))
  })

  app.get('/seats', async (_: Request, res: Response) => {
    return res.json(await administrator.getSeatTypes())
  })

  app.post('/seats', async (req: Request, res: Response) => {
    if (!req.body) {
      res.status(400).json({ message: 'Invalid request' })
    }
    const seat = req.body as SeatType
    try {
      await administrator.upsertSeatType(seat)
      res.status(201).json(seat)
    } catch (err: any) {
      res.status(400).json({ message: err.message })
    }
  })

  app.get('/seats/:id', async (req: Request, res: Response) => {
    const r = await administrator.getSeatType(req.params.id)
    if (!r) {
      return res.status(404).send('Not found')
    }
    return res.json(r)
  })

  app.delete('/seats/:id', async (req: Request, res: Response) => {
    return res.json(await administrator.deleteSeatType(req.params.id))
  })

  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`)
  })
}
