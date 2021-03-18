export enum FuelType {
  Gasoline = 0,
  Diesel = 1,
  Electro = 2,
}

export const GovFuelTypes = {
  'בנזין': FuelType.Gasoline,
  'דיזל': FuelType.Diesel,
  'חשמל/בנזין': FuelType.Electro,
  'חשמל': FuelType.Electro,
}