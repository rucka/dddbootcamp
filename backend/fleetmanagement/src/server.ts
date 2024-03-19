//import * as express from 'express'
import express, { Request, Response } from 'express'
import { createAdministratorService } from './service'
import { Aircraft, CabinLayout, SeatType } from './datalayer/contract'

export const live = () => {
  const service = createAdministratorService(false)

  const app = express()

  const port = 3000 //process.env.PORT

  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))

  app.get('/', (_: Request, res: Response) => {
    res.send('Hello, world!')
  })

  app.get('/aircrafts', async (_: Request, res: Response) => {
    return res.json(await service.getAircrafts())
  })

  app.post('/aircrafts', async (req: Request, res: Response) => {
    if (!req.body) {
      res.status(400).json({ message: 'Invalid request' })
    }
    const aircraft = req.body as Aircraft
    try {
      await service.insertAircraft(aircraft)
      res.status(201).json(aircraft)
    } catch (err: any) {
      res.status(400).json({ message: err.message })
    }
  })

  app.put('/aircrafts/:version', async (req: Request, res: Response) => {
    if (!req.body) {
      res.status(400).json({ message: 'Invalid request' })
    }
    const aircraft = req.body as Aircraft
    if (!req.params['version']) {
      return res.status(400).send('Invalid request')
    }
    const version = parseInt(req.params['version'])

    try {
      await service.updateAircraft(aircraft, version)
      res.status(201).json(aircraft)
    } catch (err: any) {
      res.status(400).json({ message: err.message })
    }
  })

  app.get('/aircrafts/:model', async (req: Request, res: Response) => {
    if (!req.params['model']) {
      return res.status(404).send('Not found')
    }
    const r = await service.getAircraft(req.params['model'])
    if (!r) {
      return res.status(404).send('Not found')
    }
    return res.json(r)
  })

  app.delete('/aircrafts/:model/:version', async (req: Request, res: Response) => {
    if (!req.params['model']) {
      return res.status(404).send('Not found')
    }
    if (!req.params['version']) {
      return res.status(400).send('Invalid request')
    }
    const version = parseInt(req.params['version'])
    return res.json(await service.deleteAircraft(req.params['model'], version))
  })

  app.get('/seats', async (_: Request, res: Response) => {
    return res.json(await service.getSeatTypes())
  })

  app.post('/seats', async (req: Request, res: Response) => {
    if (!req.body) {
      res.status(400).json({ message: 'Invalid request' })
    }

    const seat = req.body as SeatType
    try {
      await service.insertSeatType(seat)
      res.status(201).json(seat)
    } catch (err: any) {
      res.status(400).json({ message: err.message })
    }
  })

  app.put('/seats/:version', async (req: Request, res: Response) => {
    if (!req.body) {
      res.status(400).json({ message: 'Invalid request' })
    }
    if (!req.params['version']) {
      return res.status(400).send('Invalid request')
    }
    const version = parseInt(req.params['version'])

    const seat = req.body as SeatType
    try {
      await service.updateSeatType(seat, version)
      res.status(201).json(seat)
    } catch (err: any) {
      res.status(400).json({ message: err.message })
    }
  })

  app.get('/seats/:id', async (req: Request, res: Response) => {
    const r = await service.getSeatType(req.params.id)
    if (!r) {
      return res.status(404).send('Not found')
    }
    return res.json(r)
  })

  app.delete('/seats/:id/:version', async (req: Request, res: Response) => {
    if (!req.params['version']) {
      return res.status(400).send('Invalid request')
    }
    const version = parseInt(req.params['version'])

    return res.json(await service.deleteSeatType(req.params.id, version))
  })

  app.get('/layouts', async (_: Request, res: Response) => {
    return res.json(await service.getCabinLayouts())
  })

  app.post('/layouts', async (req: Request, res: Response) => {
    if (!req.body) {
      res.status(400).json({ message: 'Invalid request' })
    }

    const layout = req.body as CabinLayout
    try {
      await service.insertCabinLayout(layout)
      res.status(201).json(layout)
    } catch (err: any) {
      res.status(400).json({ message: err.message })
    }
  })

  app.put('/layouts/:version', async (req: Request, res: Response) => {
    if (!req.body) {
      res.status(400).json({ message: 'Invalid request' })
    }
    if (!req.params['version']) {
      return res.status(400).send('Invalid request')
    }
    const version = parseInt(req.params['version'])

    const layout = req.body as CabinLayout
    try {
      await service.updateCabinLayout(layout, version)
      res.status(201).json(layout)
    } catch (err: any) {
      res.status(400).json({ message: err.message })
    }
  })

  app.get('/seats/:id', async (req: Request, res: Response) => {
    const r = await service.getSeatType(req.params.id)
    if (!r) {
      return res.status(404).send('Not found')
    }
    return res.json(r)
  })

  app.delete('/seats/:id/:version', async (req: Request, res: Response) => {
    if (!req.params['version']) {
      return res.status(400).send('Invalid request')
    }
    const version = parseInt(req.params['version'])

    return res.json(await service.deleteSeatType(req.params.id, version))
  })

  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`)
  })
}
