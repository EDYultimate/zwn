import { expect, test } from 'vitest'
import { convertedToFormData } from '@/utils/request/tools/DataConveter'

test('object', () => {
  const formData = convertedToFormData({ object: { id: 1 } })
  expect(formData).toBeInstanceOf(FormData)
})
test.fails('error object', () => {
  convertedToFormData({ object: { id: 1 } })
  convertedToFormData({ files: [new File([], 'test.txt')] })
})
