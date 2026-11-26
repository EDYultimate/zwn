/** 行政区划编码 -> 名称 映射表 */
const adCdToName = [
  {
    key: '110000',
    label: '北京市'
  },
  {
    key: '120000',
    label: '天津市'
  },
  {
    key: '130000',
    label: '河北省'
  },
  {
    key: '140000',
    label: '山西省'
  },
  {
    key: '150000',
    label: '内蒙古自治区'
  },
  {
    key: '370000',
    label: '山东省'
  },
  {
    key: '410000',
    label: '河南省'
  }
]

// 用 Map 缓存编码 -> 名称的映射，避免每次调用都遍历数组
const adCdMap = new Map(adCdToName.map((item) => [item.key, item.label]))

/**
 * 根据行政区编码查询名称
 * @param adCd 行政区编码，如 '110000'
 * @returns 对应的行政区名称；未匹配到时返回空字符串
 */
export function getAdCdName(adCd: string): string {
  return adCdMap.get(adCd) ?? ''
}
