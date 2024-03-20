//import * as express from 'express'
import express, { Request, Response } from 'express'
import { createAdministratorService } from './../service'
import { Aircraft, CabinLayout, SeatType } from './../datalayer/contract'
import { createRouter } from './creatRouter'

export const live = () => {
  const service = createAdministratorService(false)

  const app = express()

  const port = process.env.PORT

  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))

  app.get('/', (_: Request, res: Response) => {
    res.send('Hello, world!')
  })

  const aircraftRouter = createRouter<Aircraft>(
    'model',
    service.getAircrafts,
    service.getAircraft,
    service.insertAircraft,
    service.updateAircraft,
    service.deleteAircraft,
  )
  app.use('/aircrafts', aircraftRouter)

  const seatRouter = createRouter<SeatType>(
    'id',
    service.getSeatTypes,
    service.getSeatType,
    service.insertSeatType,
    service.updateSeatType,
    service.deleteSeatType,
  )
  app.use('/seats', seatRouter)

  const layoutRouter = createRouter<CabinLayout>(
    'id',
    service.getCabinLayouts,
    service.getCabinLayout,
    service.insertCabinLayout,
    service.updateCabinLayout,
    service.deleteCabinLayout,
  )
  app.use('/layouts', layoutRouter)

  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`)
  })
}
