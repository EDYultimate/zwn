import { nextTick } from 'vue'
import { useRouter } from 'vue-router'
import request from '@/utils/request'
// // @ts-ignore
// import * as CryptoJS from 'crypto-js'
// import { sm4 } from 'sm-crypto'

/** 空对象类型 */
type EmptyObjectType = Record<string | number, any>
/** 空数组类型 */
type EmptyArrayType = any[]

/**
 * 校验值是否为空（null / undefined / 空字符串）
 * @param val 值
 * @returns 是否为空
 */
export function validateNull(val: unknown): boolean {
  if (val === null || val === undefined) {
    return true
  }
  if (typeof val === 'string' && val.trim() === '') {
    return true
  }
  if (Array.isArray(val) && val.length === 0) {
    return true
  }
  if (typeof val === 'object' && !Array.isArray(val) && Object.keys(val as object).length === 0) {
    return true
  }
  return false
}

/**
 * 校验是否为合法 URL
 * @param val 值
 * @returns 是否为合法 URL
 */
export function verifyUrl(val: string): boolean {
  try {
    const url = new URL(val)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

/**
 * 图片懒加载
 * @param el dom 目标元素
 * @param arr 列表数据
 * @description data-xxx 属性用于存储页面或应用程序的私有自定义数据
 */
export const lazyImg = (el: string, arr: EmptyArrayType) => {
  const io = new IntersectionObserver((res) => {
    res.forEach((v: any) => {
      if (v.isIntersecting) {
        const { img, key } = v.target.dataset
        v.target.src = img
        v.target.onload = () => {
          io.unobserve(v.target)
          arr[key].loading = false
        }
      }
    })
  })
  nextTick(() => {
    document.querySelectorAll(el).forEach((img) => io.observe(img))
  })
}

/**
 * 对象深克隆
 * @param obj 源对象
 * @returns 克隆后的对象
 */
export function deepClone(obj: EmptyObjectType) {
  let newObj: EmptyObjectType
  try {
    newObj = obj.push ? [] : {}
  } catch (error) {
    newObj = {}
  }
  for (const attr in obj) {
    if (obj[attr] && typeof obj[attr] === 'object') {
      newObj[attr] = deepClone(obj[attr])
    } else {
      newObj[attr] = obj[attr]
    }
  }
  return newObj
}

/**
 * 判断是否是移动端
 */
export function isMobile() {
  if (
    navigator.userAgent.match(
      /('phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone')/i
    )
  ) {
    return true
  }
  return false
}

/**
 * 判断数组对象中所有属性是否为空，为空则删除当前行对象
 * @description @感谢大黄
 * @param list 数组对象
 * @returns 删除空值后的数组对象
 */
export function handleEmpty(list: EmptyArrayType) {
  const arr = [] as any[]
  for (const i in list) {
    const d = [] as any[]
    for (const j in list[i]) {
      d.push(list[i][j])
    }
    const leng = d.filter((item) => item === '').length
    if (leng !== d.length) {
      arr.push(list[i])
    }
  }
  return arr
}

/**
 * 打开外部链接
 * @param val 当前点击项菜单
 */
export function handleOpenLink(val: any) {
  const router = useRouter()
  router.push(val.path)
  if (verifyUrl(String(val.meta?.isLink))) {
    window.open(val.meta?.isLink)
  } else {
    window.open(`${val.meta?.isLink}`)
  }
}
//
// /**
//  * 加密处理
//  */
// export function encryption(src: string, keyWord: string) {
//   const key = CryptoJS.enc.Utf8.parse(keyWord)
//   const encrypted = CryptoJS.AES.encrypt(src, key, {
//     iv: key,
//     mode: CryptoJS.mode.CFB,
//     padding: CryptoJS.pad.NoPadding
//   })
//   return encrypted.toString()
// }
//
// /**
//  *  解密
//  * @param src 密文
//  * @param keyWord 密钥
//  * @returns 明文
//  */
// export function decryption(src: string, keyWord: string) {
//   const key = CryptoJS.enc.Utf8.parse(keyWord)
//   const decryptd = CryptoJS.AES.decrypt(src, key, {
//     iv: key,
//     mode: CryptoJS.mode.CFB,
//     padding: CryptoJS.pad.NoPadding
//   })
//   return decryptd.toString(CryptoJS.enc.Utf8)
// }
//
// /**
//  * SM4加密处理
//  */
// export function sm4Encryption(src: string, keyWord: string) {
//   return sm4.encrypt(src, keyWord)
// }

// /**
//  * SM4解密处理
//  * @param src 密文
//  * @param keyWord 密钥
//  * @returns 明文
//  */
// export function sm4Decryption(src: string, keyWord: string) {
//   return sm4.decrypt(src, keyWord)
// }

// /**
//  * Base64 加密
//  * @param src 明文
//  * @returns 密文
//  */
// export function base64Encrypt(src: string) {
//   const encodedWord = CryptoJS.enc.Utf8.parse(src)
//   return CryptoJS.enc.Base64.stringify(encodedWord)
// }

/**
 * 下载文件
 * @param url 目标下载接口
 * @param query 查询参数
 * @param fileName 文件名称
 * @returns {*}
 */
export function downBlobFile(url: any, query: any, fileName: string) {
  return request({
    url: url,
    method: 'get',
    responseType: 'blob',
    params: query
  }).then((response) => {
    handleBlobFile(response.data, fileName)
  })
}

/**
 * blob 文件流处理
 * @param data blob 数据（或文件流）
 * @param fileName 文件名称
 */
export function handleBlobFile(data: any, fileName: string) {
  const blob = data instanceof Blob ? data : new Blob([data])
  if (blob && blob.size === 0) {
    window.$message?.error('内容为空，无法下载')
    return
  }
  const link = document.createElement('a')
  link.href = window.URL.createObjectURL(blob)
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  window.setTimeout(function () {
    URL.revokeObjectURL(link.href)
    document.body.removeChild(link)
  }, 0)
}

/**
 * @description 生成唯一 uuid
 * @return string
 */
export function generateUUID() {
  if (typeof crypto === 'object') {
    if (typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID()
    }
    if (typeof crypto.getRandomValues === 'function' && typeof Uint8Array === 'function') {
      const callback = (c: any) => {
        const num = Number(c)
        return (num ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (num / 4)))).toString(
          16
        )
      }
      return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, callback)
    }
  }
  let timestamp = new Date().getTime()
  let performanceNow =
    (typeof performance !== 'undefined' && performance.now && performance.now() * 1000) || 0
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    let random = Math.random() * 16
    if (timestamp > 0) {
      random = ((timestamp + random) % 16) | 0
      timestamp = Math.floor(timestamp / 16)
    } else {
      random = ((performanceNow + random) % 16) | 0
      performanceNow = Math.floor(performanceNow / 16)
    }
    return (c === 'x' ? random : (random & 0x3) | 0x8).toString(16)
  })
}

/**
 * 随机生成32位编码，字母+数字
 */
export function generateSecure32BitCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const randomValues = new Uint32Array(32)
  window.crypto.getRandomValues(randomValues)
  return Array.from(randomValues, (value) => chars[value % chars.length]).join('')
}

/**
 * 获取小数位数
 * @param input 数值
 * @returns 小数位数
 */
export function getNumberRadixNum(input: number) {
  const strings = input.toString().split('.')
  if (strings.length <= 1) {
    return 0
  }
  return strings[1].toString().length
}

/**
 * 获取 URL 中的查询参数值
 * @param url 目标 URL
 * @param paraName 参数名
 * @returns 参数值
 */
export function getQueryString(url: string, paraName: string) {
  const arrObj = url.split('?')
  if (arrObj.length > 1) {
    const arrPara = arrObj[1].split('&')
    let arr
    for (let i = 0; i < arrPara.length; i++) {
      arr = arrPara[i].split('=')
      if (arr !== null && arr[0] === paraName) {
        return arr[1]
      }
    }
    return ''
  }
  return ''
}

/**
 * 列表结构转树结构
 * @param data 数据
 * @param id id 字段名
 * @param parentId parentId 字段名
 * @param children children 字段名
 * @param rootId 根 id
 * @returns 树结构
 */
export function handleTree(data: any, id: any, parentId: any, children: any, rootId: any) {
  id = id || 'id'
  parentId = parentId || 'parentId'
  children = children || 'children'
  rootId =
    rootId ||
    Math.min(
      ...data.map((item: any) => {
        return item[parentId]
      })
    ) ||
    0
  const cloneData = JSON.parse(JSON.stringify(data))
  const treeData = cloneData.filter((father: any) => {
    const branchArr = cloneData.filter((child: any) => {
      return father[id] === child[parentId]
    })
    branchArr.length > 0 ? (father[children] = branchArr) : ''
    return father[parentId] === rootId
  })
  return treeData !== '' ? treeData : data
}

/**
 * 解析所有叶子节点 ID
 * @param json 树结构数据
 * @param idArr 需匹配的 id 数组
 * @param temp 临时数组
 * @returns 匹配到的 id 数组
 */
export const resolveAllEunuchNodeId = (json: any[], idArr: any[], temp: any[] = []) => {
  for (const item of json) {
    if (item.children && item.children.length !== 0) {
      resolveAllEunuchNodeId(item.children, idArr, temp)
    } else {
      temp.push(...idArr.filter((id) => id === item.id))
    }
  }
  return temp
}

/**
 * 驼峰转下划线
 * @param str 源字符串
 * @returns 下划线字符串
 */
export function toUnderline(str: string) {
  return str.replace(/([A-Z])/g, '_$1').toLowerCase()
}

/**
 * 打开新窗口
 * @param url 目标 URL
 * @param title 窗口标题
 * @param w 宽度
 * @param h 高度
 */
export function openWindow(url: string, title: string, w: number, h: number) {
  const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : (screen as any).left
  const dualScreenTop = window.screenTop !== undefined ? window.screenTop : (screen as any).top
  const width = window.innerWidth
    ? window.innerWidth
    : document.documentElement.clientWidth
      ? document.documentElement.clientWidth
      : screen.width
  const height = window.innerHeight
    ? window.innerHeight
    : document.documentElement.clientHeight
      ? document.documentElement.clientHeight
      : screen.height
  const left = width / 2 - w / 2 + dualScreenLeft
  const top = height / 2 - h / 2 + dualScreenTop
  const newWindow = window.open(
    url,
    title,
    'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=yes, copyhistory=no, width=' +
      w +
      ', height=' +
      h +
      ', top=' +
      top +
      ', left=' +
      left
  )
  if (newWindow) {
    newWindow.focus()
  }
}

/**
 * 自动适配不同的后端架构
 * 1. 例如 /act/oa/task ,在微服务架构保持不变,在单体架构编程 /admin/oa/task
 * 2. 特殊 /gen/xxx ,在微服务架构、单体架构编程 都需保持不变
 *
 * @param originUrl 原始路径
 */
export const adaptationUrl = (originUrl?: string) => {
  const isMicro = import.meta.env.VITE_IS_MICRO
  if (validateNull(isMicro) || isMicro === 'true') {
    return originUrl
  }
  return `/admin/${originUrl?.split('/').splice(2).join('/')}`
}

/**
 * @description 获取不重复的id
 * @param length id的长度
 * @return id
 */
export const getNonDuplicateID = (length = 8) => {
  let idStr = Date.now().toString(36)
  idStr += Math.random().toString(36).substring(3, length)
  return idStr
}

/**
 * @description 添加单位
 * @param value 值 100
 * @param unit 单位 px em rem
 */
export const addUnit = (value: string | number, unit = 'px') => {
  return !Object.is(Number(value), NaN) ? `${value}${unit}` : value
}

/**
 * 统一批量导出
 */
const other = {
  lazyImg: (el: string, arr: EmptyArrayType) => lazyImg(el, arr),
  deepClone: (obj: EmptyObjectType) => deepClone(obj),
  isMobile: () => isMobile(),
  handleEmpty: (list: EmptyArrayType) => handleEmpty(list),
  handleOpenLink: (val: any) => handleOpenLink(val),
  // encryption: (src: string, keyWord: string) => encryption(src, keyWord),
  // decryption: (src: string, keyWord: string) => decryption(src, keyWord),
  // sm4Encryption: (src: string, keyWord: string) => sm4Encryption(src, keyWord),
  // sm4Decryption: (src: string, keyWord: string) => sm4Decryption(src, keyWord),
  // base64Encrypt: (data: any) => base64Encrypt(data),
  downBlobFile: (url: any, query: any, fileName: string) => downBlobFile(url, query, fileName),
  toUnderline: (str: string) => toUnderline(str),
  openWindow: (url: string, title: string, w: number, h: number) => openWindow(url, title, w, h),
  getQueryString: (url: string, paraName: string) => getQueryString(url, paraName),
  adaptationUrl: (url?: string) => adaptationUrl(url),
  resolveAllEunuchNodeId: (json: any[], idArr: any[], temp: any[] = []) =>
    resolveAllEunuchNodeId(json, idArr, temp),
  getNonDuplicateID: (length = 8) => getNonDuplicateID(length),
  addUnit: (value: string | number, unit = 'px') => addUnit(value, unit),
  validateNull: (value: any) => validateNull(value),
  getNumberRadixNum: (input: number) => getNumberRadixNum(input)
}

export default other
