import { createInMemoryDb, createPostgres } from './../datalayer'
import { CabinLayout, Db } from './../datalayer/model'

export type AdministratorService = {
  insertAircraft: Db['insertAircraft']
  updateAircraft: Db['updateAircraft']
  getAircraft: Db['getAircraft']
  getAircrafts: Db['getAircrafts']
  deleteAircraft: Db['deleteAircraft']
  insertSeatType: Db['insertSeatType']
  updateSeatType: Db['updateSeatType']
  getSeatType: Db['getSeatType']
  getSeatTypes: Db['getSeatTypes']
  deleteSeatType: Db['deleteSeatType']
  insertCabinLayout: (layout: CabinLayout) => Promise<void>
  updateCabinLayout: (layout: CabinLayout, version: number) => Promise<void>
  getCabinLayout: Db['getCabinLayout']
  getCabinLayouts: Db['getCabinLayouts']
  deleteCabinLayout: Db['deleteCabinLayout']
  insertFleetUnit: Db['insertFleetUnit']
  updateFleetUnit: Db['updateFleetUnit']
  getFleetUnit: Db['getFleetUnit']
  getFleetUnits: Db['getFleetUnits']
  deleteFleetUnit: Db['deleteFleetUnit']
}

export const createAdministratorService: (inmemory: boolean) => AdministratorService = inmemory => {
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
    insertCabinLayout: async layout => {
      await validateLayout(db)(layout)
      await db.insertCabinLayout(layout)
    },
    updateCabinLayout: async (layout, version) => {
      await validateLayout(db)(layout)
      await db.updateCabinLayout(layout, version)
    },
    getCabinLayout: db.getCabinLayout,
    getCabinLayouts: db.getCabinLayouts,
    deleteCabinLayout: db.deleteCabinLayout,
    insertFleetUnit: db.insertFleetUnit,
    updateFleetUnit: db.updateFleetUnit,
    getFleetUnit: db.getFleetUnit,
    getFleetUnits: db.getFleetUnits,
    deleteFleetUnit: db.deleteFleetUnit,
  }
}
const validateLayout = (db: Db) => async (layout: CabinLayout) => {
  if (!layout.id) {
    throw new Error('layout requires id')
  }
  for await (const row of layout.rows) {
    const type = await db.getSeatType(row.type)
    if (!type) {
      throw new Error(`row type ${type} not found`)
    }
    if (row.extraSpace < 0 || row.extraSpace > 100) {
      throw new Error(`Extra space have to be positive and seats have to be less than 100`)
    }
    const width = type.width * row.seats
    if (width > layout.width) {
      throw new Error(`row width ${width} exceeds layout width ${layout.width}`)
    }
    if (width === layout.width) {
      throw new Error(`row have to provide at least 1 aisle`)
    }
  }
}
