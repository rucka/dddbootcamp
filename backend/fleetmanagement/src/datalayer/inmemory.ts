import type { Aircraft, Db, SeatType } from './contract'
import data from './data'

export const createInMemoryDb = (): Db => {
  const database = data

  const db: Db = {
    upsertAircraft: function (aircraft: Aircraft): Promise<void> {
      const i = database.aircrafts.findIndex(a => a.model === aircraft.model)
      if (!i || i === -1) {
        database.aircrafts.push(aircraft)
      } else {
        database.aircrafts[i] = aircraft
      }
      return Promise.resolve()
    },
    getAircraft: function (model: string): Promise<Aircraft | undefined> {
      return Promise.resolve(database.aircrafts.find(a => a.model === model))
    },
    getAircrafts: function (): Promise<Aircraft[]> {
      return Promise.resolve(JSON.parse(JSON.stringify(database.aircrafts)))
    },
    deleteAircraft: function (model: string): Promise<void> {
      const a = database.aircrafts.find(a => a.model === model)
      if (a) {
        database.aircrafts = database.aircrafts.filter(x => x.model !== a.model)
      }
      return Promise.resolve()
    },
    upsertSeatType: function (seatType: SeatType): Promise<void> {
      const i = database.seats.findIndex(a => a.id === seatType.id)
      if (!i || i === -1) {
        database.seats.push(seatType)
      } else {
        database.seats[i] = seatType
      }
      return Promise.resolve()
    },
    getSeatType: function (id: string): Promise<SeatType | undefined> {
      return Promise.resolve(database.seats.find(a => a.id === id))
    },
    getSeatTypes: function (): Promise<SeatType[]> {
      return Promise.resolve(JSON.parse(JSON.stringify(database.seats)))
    },
    deleteSeatType: function (id: string): Promise<void> {
      const a = database.seats.find(a => a.id === id)
      if (a) {
        database.seats = database.seats.filter(x => x.id !== a.id)
      }
      return Promise.resolve()
    },
  }
  return db
}
