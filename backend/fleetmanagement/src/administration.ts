import { createInMemoryDb, createPostgres } from './datalayer'

export const createAdministratorService = (inmemory: boolean) => {
  const db = inmemory ? createInMemoryDb() : createPostgres()
  return {
    insertAircraft: db.insertAircraft,
    updateAircraft: db.updateAircraft,
    getAircraft: db.getAircraft,
    getAircrafts: db.getAircrafts,
    deleteAircraft: db.deleteAircraft,
    insertSeatType: db.insertSeatType,
    updateSeatType: db.updateSeatType,
    getSeatType: db.getSeatType,
    getSeatTypes: db.getSeatTypes,
    deleteSeatType: db.deleteSeatType,
  }
}
