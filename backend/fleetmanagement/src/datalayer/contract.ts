import { type } from 'os'

export type Aircraft = {
  model: string
  manufacturer: string
  wingspan: number
  cabinWidth: number
  cabinHeight: number
  cabinLength: number
  cargoCapacity: number
  range: number
  cruiseSpeed: number
  engineType: string
  noiseLevel: string
}

export type SeatType = {
  id: string
  type: string
  width: number
  height: number
  pitch: number
  weight: number
  productionDate: number
  comfortLevel: number
  features: string[]
}

export type CabinLayout = { id: String; length: number; width: number; rows: CabinRow[] }
export type CabinRow = { type: SeatType['id']; seats: number; extraSpace: number }

/*
const row1: CabinRow = {
  type: 'BIZ-ADV',
  seats:4,
  //groups: [{ seats: ['seat', 'seat', 'empty'], aisle: 106 }, { seats: ['empty', 'seat', 'seat'] }],
  extraSpace: 0,
}
*/

export type Versioned<T> = T & { version: number }

export type Db = {
  insertAircraft: (aircraft: Aircraft) => Promise<void>
  updateAircraft: (aircraft: Aircraft, version: number) => Promise<void>
  getAircraft: (model: Aircraft['model']) => Promise<Versioned<Aircraft> | undefined>
  getAircrafts: () => Promise<Versioned<Aircraft>[]>
  deleteAircraft: (model: Aircraft['model'], version: number) => Promise<void>
  insertSeatType: (seatType: SeatType) => Promise<void>
  updateSeatType: (seatType: SeatType, version: number) => Promise<void>
  getSeatType: (id: SeatType['id']) => Promise<Versioned<SeatType> | undefined>
  getSeatTypes: () => Promise<Versioned<SeatType>[]>
  deleteSeatType: (id: SeatType['id'], version: number) => Promise<void>
  insertCabinLayout: (layout: CabinLayout) => Promise<void>
  updateCabinLayout: (layout: CabinLayout, version: number) => Promise<void>
  getCabinLayout: (id: CabinLayout['id']) => Promise<Versioned<CabinLayout> | undefined>
  getCabinLayouts: () => Promise<Versioned<CabinLayout>[]>
  deleteCabinLayout: (model: CabinLayout['id'], version: number) => Promise<void>
}

export const strictVersionize = <T>(entity: T, version: number): Versioned<T> => ({
  ...entity,
  ...{ version },
})

export const versionize = <T>(entity: T | undefined, version: number): Versioned<T> | undefined =>
  entity ? strictVersionize(entity, version) : undefined
