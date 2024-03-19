import { Pool } from 'pg'
import type { Aircraft, Db, SeatType } from './contract'

export const createPostgres = (): Db => {
  const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    port: 5432,
  })

  const db: Db = {
    upsertAircraft: async function (aircraft: Aircraft): Promise<void> {
      await pool.query(
        'INSERT INTO entities (id, entity, data) VALUES ($1, $2, $3) ON CONFLICT (id, entity) DO UPDATE SET data = $3',
        [aircraft.model, 'aircraft', JSON.stringify(aircraft)],
      )
    },
    getAircraft: async function (model: string): Promise<Aircraft | undefined> {
      const r = await pool.query<{ data: Aircraft }>(
        'SELECT data FROM entities WHERE entity = $1 and id = $2',
        ['aircraft', model],
      )
      return r && r.rowCount && r.rowCount > 0 ? r.rows[0].data : undefined
    },
    getAircrafts: async function (): Promise<Aircraft[]> {
      const r = await pool.query<{ data: Aircraft }>(
        'SELECT data FROM entities WHERE entity = $1',
        ['aircraft'],
      )
      return r.rowCount == 0 ? [] : r.rows.map(r => r.data)
    },
    deleteAircraft: async function (model: string): Promise<void> {
      await pool.query('DELETE FROM entities WHERE entity = $1 and id = $2', ['aircraft', model])
    },
    upsertSeatType: async function (seat: SeatType): Promise<void> {
      await pool.query(
        'INSERT INTO entities (id, entity, data) VALUES ($1, $2, $3) ON CONFLICT (id, entity) DO UPDATE SET data = $3',
        [seat.id, 'seat', JSON.stringify(seat)],
      )
    },
    getSeatType: async function (id: string): Promise<SeatType | undefined> {
      const r = await pool.query<{ data: SeatType }>(
        'SELECT data FROM entities WHERE entity = $1 and id = $2',
        ['seat', id],
      )
      return r && r.rowCount && r.rowCount > 0 ? r.rows[0].data : undefined
    },
    getSeatTypes: async function (): Promise<SeatType[]> {
      const r = await pool.query<{ data: SeatType }>(
        'SELECT data FROM entities WHERE entity = $1',
        ['seat'],
      )
      return r.rowCount == 0 ? [] : r.rows.map(r => r.data)
    },
    deleteSeatType: async function (id: string): Promise<void> {
      await pool.query('DELETE FROM entities WHERE entity = $1 and id = $2', ['seat', id])
    },
  }
  return db
}
