import { Pool } from 'pg'
import { strictVersionize, type Aircraft, type Db, type SeatType, type Versioned, CabinLayout } from './contract'

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
      await pool.query('INSERT INTO entities (id, entity, data, version) VALUES ($1, $2, $3, 1)', [
        aircraft.model,
        'aircraft',
        JSON.stringify(aircraft),
      ])
    },
    updateAircraft: async function (aircraft: Aircraft, version: number): Promise<void> {
      const r = await pool.query(
        'UPDATE entities SET data = $4, version = ($3 + 1) WHERE id = $1 AND entity = $2 AND version = $3',
        [aircraft.model, 'aircraft', String(version), JSON.stringify(aircraft)]
      )
      if (r.rowCount == 0) {
        throw new Error('Conflict')
      }
    },
    getAircraft: async function (model: string): Promise<Versioned<Aircraft> | undefined> {
      const r = await pool.query<{ data: Aircraft; version: number} >(
        'SELECT data, version FROM entities WHERE entity = $1 and id = $2',
        ['aircraft', model]
      )
      return r && r.rowCount && r.rowCount > 0
        ? strictVersionize(r.rows[0].data, r.rows[0].version)
        : undefined
    },
    getAircrafts: async function (): Promise<Versioned<Aircraft>[]> {
      const r = await pool.query<{ data: Aircraft; version: number} >(
        'SELECT data, version FROM entities WHERE entity = $1',
        ['aircraft']
      )
      return r.rowCount == 0 ? [] : r.rows.map(r => strictVersionize(r.data, r.version))
    },
    deleteAircraft: async function (model: string): Promise<void> {
      await pool.query('DELETE FROM entities WHERE entity = $1 and id = $2', ['aircraft', model])
    },
    insertSeatType: async function (seat: SeatType): Promise<void> {
      await pool.query('INSERT INTO entities (id, entity, data, version) VALUES ($1, $2, $3, 1)', [
        seat.id,
        'seat',
        JSON.stringify(seat),
      ])
    },
    updateSeatType: async function (seat: SeatType, version: number): Promise<void> {
      const r = await pool.query(
        'UPDATE entities SET data = $4, version = ($3 + 1) WHERE id = $1 AND entity = $2 AND version = $3',
        [seat.id, 'seat', String(version), JSON.stringify(seat)]
      )
      if (r.rowCount == 0) {
        throw new Error('Conflict')
      }
    },
    getSeatType: async function (id: string): Promise<Versioned<SeatType> | undefined> {
      const r = await pool.query<{ data: SeatType; version: number} >(
        'SELECT data FROM entities WHERE entity = $1 and id = $2',
        ['seat', id]
      )
      return r && r.rowCount && r.rowCount > 0
        ? strictVersionize(r.rows[0].data, r.rows[0].version)
        : undefined
    },
    getSeatTypes: async function (): Promise<Versioned<SeatType>[]> {
      const r = await pool.query<{ data: SeatType; version: number} >(
        'SELECT data FROM entities WHERE entity = $1',
        ['seat']
      )
      return r.rowCount == 0 ? [] : r.rows.map(r => strictVersionize(r.data, r.version))
    },
    deleteSeatType: async function (id: string): Promise<void> {
      await pool.query('DELETE FROM entities WHERE entity = $1 and id = $2', ['seat', id])
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
    }
  }
  return db
}
