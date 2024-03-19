import { createInMemoryDb, createPostgres } from './../datalayer'
import { CabinLayout, Db } from './../datalayer/contract'

type AdministratorService = {
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
    const width = type.width * row.seats + row.extraSpace
    if (width > layout.width) {
      throw new Error(`row width ${width} exceeds layout width ${layout.width}`)
    }
    //await validateRow(db)(row)
  }

  // throw new Error('layout not valid')
}
/*
const validateRow = (db: Db) => async (row: CabinRow) => {
  if (!row.type) {
    throw new Error('row requires type')
  }

  if (!row.seats) {
    throw new Error('row requires seats')
  }

  if (!row.extraSpace) {
    throw new Error('row requires extraSpace')
  } else if (row.extraSpace < 0) {
    throw new Error('row extraSpace cannot be negative')
  }
}
*/
