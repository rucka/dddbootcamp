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

export type Versioned<T> = T & { version: number }

export type Db = {
  insertAircraft: (aircraft: Aircraft) => Promise<void>
  updateAircraft: (aircraft: Aircraft, version: number) => Promise<void>
  getAircraft: (model: string) => Promise<Versioned<Aircraft> | undefined>
  getAircrafts: () => Promise<Versioned<Aircraft>[]>
  deleteAircraft: (model: string, version: number) => Promise<void>
  insertSeatType: (seatType: SeatType) => Promise<void>
  updateSeatType: (seatType: SeatType, version: number) => Promise<void>
  getSeatType: (id: string) => Promise<Versioned<SeatType> | undefined>
  getSeatTypes: () => Promise<Versioned<SeatType>[]>
  deleteSeatType: (id: string, version: number) => Promise<void>
}

export const strictVersionize = <T>(entity: T, version: number): Versioned<T> => ({
  ...entity,
  ...{ version },
})

export const versionize = <T>(entity: T | undefined, version: number): Versioned<T> | undefined =>
  entity ? strictVersionize(entity, version) : undefined
