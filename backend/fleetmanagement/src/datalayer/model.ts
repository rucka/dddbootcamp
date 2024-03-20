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

export type CabinLayout = { id: string; length: number; width: number; rows: CabinRow[] }
export type CabinRow = { type: SeatType['id']; seats: number; extraSpace: number }

/*
const layout1: CabinLayout = {
  id: '1',
  length: 10,
  width: 10,
  rows: [
    {
      type: 'BIZ-ADV',
      seats: 4,
      extraSpace: 0,
    },
  ],
}

const row1: CabinRow = {
  type: 'BIZ-ADV',
  seats:4,
  extraSpace: 0,
}
*/

export type FleetUnit = {
  tailNumber: string
  model: string
  manufacturingDate: String
  dateOfPurchase: string
  nextMaintenanceDate: string
  cabinLayoutId: string
}

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
  deleteCabinLayout: (id: CabinLayout['id'], version: number) => Promise<void>
  insertFleetUnit: (unit: FleetUnit) => Promise<void>
  updateFleetUnit: (unit: FleetUnit, version: number) => Promise<void>
  getFleetUnit: (tailNumber: FleetUnit['tailNumber']) => Promise<Versioned<FleetUnit> | undefined>
  getFleetUnits: () => Promise<Versioned<FleetUnit>[]>
  deleteFleetUnit: (tailNumber: FleetUnit['tailNumber'], version: number) => Promise<void>
}

export const strictVersionize = <T>(entity: T, version: number): Versioned<T> => ({
  ...entity,
  ...{ version },
})

export const versionize = <T>(entity: T | undefined, version: number): Versioned<T> | undefined =>
  entity ? strictVersionize(entity, version) : undefined
