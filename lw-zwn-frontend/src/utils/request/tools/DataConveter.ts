import { isObject } from '@/utils/is'

type CustomObject = {
  [key: string]: any
}

type ConvertedOptions<T extends CustomObject> =
  | { object: T; files?: File[]; key?: string }
  | { object?: undefined; files: File[]; key?: string }

export function convertedToFormData<T extends CustomObject>(options: ConvertedOptions<T>) {
  const fromData = new FormData()
  const { object, files, key = 'files' } = options
  if (object && isObject(object)) {
    Object.keys(object).forEach((objKey) => {
      const value = object[objKey]
      if (Array.isArray(value)) {
        value.forEach((subValue) => fromData.append(objKey, subValue))
      } else {
        fromData.append(objKey, object[objKey])
      }
    })
  }
  if (files && files.length > 0) {
    files.forEach((file) => fromData.append(key, file))
  }
  return fromData
}
export default convertedToFormData
