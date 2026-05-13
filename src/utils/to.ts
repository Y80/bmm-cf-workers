export function to<T, U = Error>(
  promise: Promise<T>,
  errorExt?: object,
): Promise<[U, undefined] | [null, T]> {
  return promise
    .then<[null, T]>((data) => [null, data])
    .catch<[U, undefined]>((err) => {
      if (errorExt) Object.assign(err, errorExt)
      return [err, undefined]
    })
}
