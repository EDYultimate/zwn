import Qs from 'qs'
import {
  computed,
  nextTick,
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  shallowRef,
  toRaw,
  toRef,
  toRefs,
  watch,
  watchEffect
} from 'vue'

/**
 * 根据给出数字转成罗马数字
 * @param {*} num
 * @returns
 */
export function numberToRoman(num: string): string {
  if (Number.isNaN(num)) {
    return '-'
  }
  switch (num) {
    case '1':
      return 'I'
    case '2':
      return 'Ⅱ'
    case '3':
      return 'Ⅲ'
    case '4':
      return 'Ⅳ'
    case '5':
      return 'V'
    case '6':
      return 'Ⅵ'
    case '7':
      return 'Ⅶ'
    default:
      throw new Error(`传入的数字超出范围,合法范围1-7,传入:[${num}]`)
  }
}

/**
 * 从Location对象中解析得到当前 URL
 * 从 URL 中去掉 query = xxx 后返回
 * @param queryKey
 * @return string
 * @example
 *
 * 当前地址是:
 *      http://10.3.34.105:8087/powers_sys/sysfront/cas/loginCheck?ticket=aaaaaa&account=endueXp0#abc
 * getURLWithoutQueryKey('ticket') 返回:
 *      http://10.3.34.105:8087/powers_sys/sysfront/cas/loginCheck?account=endueXp0#abc
 *
 */
export function getURLWithoutQueryKey(queryKey: string) {
  let search = location.search
  search = search.replace('?&', '?')
  const query = Qs.parse(search, { ignoreQueryPrefix: true })

  if (query !== undefined && query[queryKey] !== undefined) {
    const { [queryKey]: key, ...otherParams } = query
    const queryStrWithoutSomeParam = Object.entries(otherParams)
      .map(([k, v]) => `${k}=${v}`)
      .join('=')
    if (queryStrWithoutSomeParam === '') {
      return location.origin + location.pathname + location.hash
    }
    return `${location.origin + location.pathname}?${queryStrWithoutSomeParam}${location.hash}`
  }
  return location.href
}

// 通用参数过滤函数，移除null、undefined和空字符串
export function filterParams(params: any) {
  const result = {}
  Object.keys(params).forEach((key) => {
    if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
      Object.assign(result, { [key]: params[key] })
    }
  })
  return result
}

export const v = {
  ref,
  shallowRef,
  reactive,
  toRaw,
  nextTick,
  watchEffect,
  watch,
  computed,
  onBeforeMount,
  onMounted,
  onBeforeUnmount,
  toRef,
  toRefs
}
