/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const setField = (object: any, fieldPath: string, value: any) => {
  const arr = fieldPath.split(`.`)

  let curField = object
  for (let i = 0; i < arr.length; i += 1) {
    const key = arr[i]
    if (i === arr.length - 1) {
      curField[key] = value
    } else {
      if (typeof curField[key] === `undefined`) {
        // changed
        if (Number.isNaN(key)) {
          curField[key] = {}
        } else {
          curField[key] = []
        }
      }
      curField = curField[key]
    }
  }

  return object
}

export const fieldSet = (
  /* eslint-disable @typescript-eslint/no-explicit-any */
  object: any,
  fieldPathsOrFieldPath: string | string[] | Record<string, any>,
  valuesOrValue?: any | any[],
  /* eslint-enable */
) => {
  if (Array.isArray(fieldPathsOrFieldPath)) {
    if (!Array.isArray(valuesOrValue)) {
      throw new Error(`values not array when fieldPaths is array`)
    }

    for (let i = 0; i < valuesOrValue.length; i += 1) {
      setField(object, fieldPathsOrFieldPath[i], valuesOrValue[i])
    }
    return object
  }

  if (typeof fieldPathsOrFieldPath === `string`) {
    return setField(object, fieldPathsOrFieldPath, valuesOrValue)
  }

  if (typeof fieldPathsOrFieldPath === `object` && !valuesOrValue) {
    Object.entries(fieldPathsOrFieldPath).forEach(([k, v]) => {
      setField(object, k, v)
    })
    return object
  }

  throw new Error(
    `Invalid set : ${JSON.stringify(
      { object, fieldPathsOrFieldPath, valuesOrValue },
      null,
      2,
    )}`,
  )
}
