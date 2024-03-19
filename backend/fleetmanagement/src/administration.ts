import { createInMemoryDb, createPostgres } from './datalayer'

export const createAdministratorService = (inmemory: boolean) => {
  const db = inmemory ? createInMemoryDb() : createPostgres()
  return {
    upsertAircraft: db.upsertAircraft,
    getAircraft: db.getAircraft,
    getAircrafts: db.getAircrafts,
    deleteAircraft: db.deleteAircraft,
    upsertSeatType: db.upsertSeatType,
    getSeatType: db.getSeatType,
    getSeatTypes: db.getSeatTypes,
    deleteSeatType: db.deleteSeatType,
  }
}
