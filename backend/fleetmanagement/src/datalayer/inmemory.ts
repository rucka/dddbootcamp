import type { Db, Versioned, Aircraft, SeatType, CabinLayout, FleetUnit } from './model'
import { versionize, strictVersionize } from './model'
import data from './data'

export const createInMemoryDb = (): Db => {
  const database = data

  const db: Db = {
    insertAircraft: function (aircraft: Aircraft): Promise<void> {
      database.aircrafts.push(aircraft)
      return Promise.resolve()
    },
    updateAircraft: function (aircraft: Aircraft, _: number): Promise<void> {
      const i = database.aircrafts.findIndex(a => a.model === aircraft.model)
      if (!i || i === -1) {
        database.aircrafts.push(aircraft)
      } else {
        database.aircrafts[i] = aircraft
      }
      return Promise.resolve()
    },
    getAircraft: function (model: string): Promise<Versioned<Aircraft> | undefined> {
      return Promise.resolve(
        versionize(
          database.aircrafts.find(a => a.model === model),
          1,
        ),
      )
    },
    getAircrafts: function (): Promise<Versioned<Aircraft>[]> {
      const xs: Aircraft[] = JSON.parse(JSON.stringify(database.aircrafts))
      const versionxs: Versioned<Aircraft>[] = xs.map(x => strictVersionize(x, 1))
      return Promise.resolve(versionxs)
    },
    deleteAircraft: function (model: string, _: number): Promise<void> {
      const a = database.aircrafts.find(a => a.model === model)
      if (a) {
        database.aircrafts = database.aircrafts.filter(x => x.model !== a.model)
      }
      return Promise.resolve()
    },
    insertSeatType: function (seatType: SeatType): Promise<void> {
      database.seats.push(seatType)
      return Promise.resolve()
    },
    updateSeatType: (seatType: SeatType, _: number): Promise<void> => {
      const i = database.seats.findIndex(a => a.id === seatType.id)
      if (!i || i === -1) {
        database.seats.push(seatType)
      } else {
        database.seats[i] = seatType
      }
      return Promise.resolve()
    },
    getSeatType: function (id: string): Promise<Versioned<SeatType> | undefined> {
      return Promise.resolve(
        versionize(
          database.seats.find(a => a.id === id),
          1,
        ),
      )
    },
    getSeatTypes: function (): Promise<Versioned<SeatType>[]> {
      const xs: SeatType[] = JSON.parse(JSON.stringify(database.seats))
      const versionxs: Versioned<SeatType>[] = xs.map(x => strictVersionize(x, 1))
      return Promise.resolve(versionxs)
    },
    deleteSeatType: function (id: string, version: number): Promise<void> {
      const a = database.seats.find(a => a.id === id)
      if (a) {
        database.seats = database.seats.filter(x => x.id !== a.id)
      }
      return Promise.resolve()
    },
    insertCabinLayout: function (layout: CabinLayout): Promise<void> {
      throw new Error('Function not implemented.')
    },
    updateCabinLayout: function (layout: CabinLayout, version: number): Promise<void> {
      throw new Error('Function not implemented.')
    },
    getCabinLayout: function (id: String): Promise<Versioned<CabinLayout> | undefined> {
      throw new Error('Function not implemented.')
    },
    getCabinLayouts: function (): Promise<Versioned<CabinLayout>[]> {
      throw new Error('Function not implemented.')
    },
    deleteCabinLayout: function (model: String, version: number): Promise<void> {
      throw new Error('Function not implemented.')
    },
    insertFleetUnit: function (unit: FleetUnit): Promise<void> {
      throw new Error('Function not implemented.')
    },
    updateFleetUnit: function (unit: FleetUnit, version: number): Promise<void> {
      throw new Error('Function not implemented.')
    },
    getFleetUnit: function (tailNumber: string): Promise<Versioned<FleetUnit> | undefined> {
      throw new Error('Function not implemented.')
    },
    getFleetUnits: function (): Promise<Versioned<FleetUnit>[]> {
      throw new Error('Function not implemented.')
    },
    deleteFleetUnit: function (tailNumber: string, version: number): Promise<void> {
      throw new Error('Function not implemented.')
    },
  }
  return db
}
