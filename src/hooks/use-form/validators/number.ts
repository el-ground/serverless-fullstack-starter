export const integer = (value: string, min: number, max: number) => {
  const parsedInt = parseInt(value)
  const parsedFloat = parseInt(value)
  if (isNaN(parsedInt)) {
    return `number`
  }

  if (parsedInt !== parsedFloat) {
    return `number` // not an int!
  }

  if (parsedInt < min) {
    return `range`
  }

  if (parsedInt > max) {
    return `range`
  }

  return null
}
