import { Pool } from 'pg'
import {
  strictVersionize,
  type Aircraft,
  type Db,
  type SeatType,
  type Versioned,
  CabinLayout,
} from './contract'

const AIRCRAFT = 'aircraft'
const SEAT_TYPE = 'seat'
const CABIN_LAYOUT = 'cabinLayout'

export const createPostgres = (): Db => {
  const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    port: 5432,
  })

  const db: Db = {
    insertAircraft: async function (aircraft: Aircraft): Promise<void> {
      return insert(pool, AIRCRAFT, aircraft.model, aircraft)
    },
    updateAircraft: async function (aircraft: Aircraft, version: number): Promise<void> {
      return update(pool, AIRCRAFT, aircraft.model, aircraft, version)
    },
    getAircraft: async function (model: string): Promise<Versioned<Aircraft> | undefined> {
      return getById(pool, AIRCRAFT, model)
    },
    getAircrafts: async function (): Promise<Versioned<Aircraft>[]> {
      return getAll(pool, AIRCRAFT)
    },
    deleteAircraft: async function (model: string, version: number): Promise<void> {
      return deleteById(pool, AIRCRAFT, model, version)
    },
    insertSeatType: async function (seat: SeatType): Promise<void> {
      return insert(pool, SEAT_TYPE, seat.id, seat)
    },
    updateSeatType: async function (seat: SeatType, version: number): Promise<void> {
      return update(pool, SEAT_TYPE, seat.id, seat, version)
    },
    getSeatType: async function (id: string): Promise<Versioned<SeatType> | undefined> {
      return getById(pool, SEAT_TYPE, id)
    },
    getSeatTypes: async function (): Promise<Versioned<SeatType>[]> {
      return getAll(pool, SEAT_TYPE)
    },
    deleteSeatType: async function (id: string, version: number): Promise<void> {
      deleteById(pool, SEAT_TYPE, id, version)
    },
    insertCabinLayout: function (layout: CabinLayout): Promise<void> {
      return insert(pool, CABIN_LAYOUT, layout.id, layout)
    },
    updateCabinLayout: function (layout: CabinLayout, version: number): Promise<void> {
      return update(pool, CABIN_LAYOUT, layout.id, layout, version)
    },
    getCabinLayout: function (id: string): Promise<Versioned<CabinLayout> | undefined> {
      return getById(pool, CABIN_LAYOUT, id)
    },
    getCabinLayouts: function (): Promise<Versioned<CabinLayout>[]> {
      return getAll(pool, CABIN_LAYOUT)
    },
    deleteCabinLayout: function (id: string, version: number): Promise<void> {
      return deleteById(pool, CABIN_LAYOUT, id, version)
    },
  }
  return db
}

const insert = async <T>(pool: Pool, entity: string, id: string, data: T) => {
  await pool.query('INSERT INTO entities (id, entity, data, version) VALUES ($1, $2, $3, 1)', [
    id,
    entity,
    JSON.stringify(data),
  ])
}

const update = async <T>(
  pool: Pool,
  entity: string,
  id: string,
  data: T,
  version: number,
): Promise<void> => {
  const r = await pool.query(
    'UPDATE entities SET data = $4, version = ($3 + 1) WHERE id = $1 AND entity = $2 AND version = $3',
    [id, entity, String(version), JSON.stringify(data)],
  )
  if (r.rowCount == 0) {
    throw new Error(`Conflict on version ${version} for entity ${id}`)
  }
}

const getById = async <T>(
  pool: Pool,
  entity: string,
  id: string,
): Promise<Versioned<T> | undefined> => {
  const r = await pool.query<{ data: T; version: number }>(
    'SELECT data, version FROM entities WHERE entity = $1 and id = $2',
    [entity, id],
  )
  return r && r.rowCount && r.rowCount > 0
    ? strictVersionize(r.rows[0].data, r.rows[0].version)
    : undefined
}

const getAll = async <T>(pool: Pool, entity: string): Promise<Versioned<T>[]> => {
  const r = await pool.query<{ data: T; version: number }>(
    'SELECT data, version FROM entities WHERE entity = $1',
    [entity],
  )
  return r.rowCount == 0 ? [] : r.rows.map(r => strictVersionize(r.data, r.version))
}

const deleteById = async (
  pool: Pool,
  entity: string,
  id: string,
  version: number,
): Promise<void> => {
  await pool.query('DELETE FROM entities WHERE entity = $1 and id = $2 and version = $3', [
    entity,
    id,
    String(version),
  ])
}
