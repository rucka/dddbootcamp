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

export type Db = {
  upsertAircraft: (aircraft: Aircraft) => Promise<void>
  getAircraft: (model: string) => Promise<Aircraft | undefined>
  getAircrafts: () => Promise<Aircraft[]>
  deleteAircraft: (model: string) => Promise<void>
  upsertSeatType: (seatType: SeatType) => Promise<void>
  getSeatType: (id: string) => Promise<SeatType | undefined>
  getSeatTypes: () => Promise<SeatType[]>
  deleteSeatType: (id: string) => Promise<void>
}
