import { ref } from 'vue'
import { queryDsMaxTime, queryStcdDailyRange, queryStcdInfo } from '@/api/waterdisp'

/**
 * 地图点位点击 → 单站详情弹窗（多页共用）
 *
 * 协议（两种地图消息格式均兼容）：
 *  - gis2 常驻地图（public/gis/gis2）：要素点击 postMessage
 *      `{ eventname: 'details', code, name, layername }`；
 *  - 旧样例地图（gismapbox_es，module=diaoshuiguanli）：点击点位后 postMessage
 *      `{ eventname: 'details', STCD, MARK, TM, STNM }`（GIS 端方法名 postNodeDetail）。
 *
 * 处理链路：解析查询日（消息 TM → 库中最新有数据日 → 当天）→ 补站类（水库站 RR 切水库原型）→
 *          取该站当日实时值（Q/AWQ/Z/W/DAY_Q）→ 打开 StationDetailDialog。
 *
 * ⚠️ 兜底：所选日无数据时，回退到该站「最新有数据日」（向前回溯 240 天取最后一条）。
 *    漳河各站日数据止于 2026-07-27、月报止于 2026-05，不回退的话弹窗里实时信息与日过程线
 *    全是空值，逐站看起来"数据都一样"（数据本身是真实且逐站不同的）。
 */
export function useMapStationDialog() {
  const mapStationShow = ref(false)
  const mapStationRow = ref<Record<string, any> | null>(null)
  const mapStationWt = ref('')

  function todayStr() {
    const d = new Date()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    return `${d.getFullYear()}-${mm}-${dd}`
  }

  /** 由 yyyy-MM-dd 往前推 n 天（用于"该站最新有数据日"兜底查询） */
  function backoffDay(day: string, n: number) {
    const d = new Date(`${day}T00:00:00`)
    if (isNaN(d.getTime())) {
      return day
    }
    d.setDate(d.getDate() - n)
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    return `${d.getFullYear()}-${mm}-${dd}`
  }

  /** 查询日：消息带 TM 用它，否则取库中最新有数据日期，最后兜底当天 */
  async function resolveWtTime(tm: any) {
    const t = tm ? String(tm).substring(0, 10) : ''
    if (t) {
      return t
    }
    try {
      const res: any = await queryDsMaxTime()
      return res?.code === 0 && res.data ? String(res.data).substring(0, 10) : todayStr()
    } catch (e) {
      console.warn('queryDsMaxTime failed', e)
      return todayStr()
    }
  }

  /** 地图消息处理：{ STCD, TM, STNM } 或 gis2 的 { code, name } → 打开单站详情弹窗 */
  async function onMapNodeClick(data: any) {
    // gis2 details 载荷用 code/name，旧样例地图用 STCD/STNM，二者均兼容
    const stcd = String(data?.STCD ?? data?.code ?? '').trim()
    // 无站码的虚拟节点（如节水节点）不弹详情
    if (!stcd) {
      return
    }
    let wt = await resolveWtTime(data?.TM)
    const row: Record<string, any> = {
      STCD: stcd,
      STNM: String(data?.STNM ?? data?.name ?? '').trim(),
      TM: wt
    }

    // 站类：点击消息不含 STTP，补查一次，水库站（RR）才能切到东榆林水库原型
    try {
      const info: any = await queryStcdInfo(stcd)
      if (info?.code === 0 && info.data) {
        if (info.data.sttp) {
          row.STTP = info.data.sttp
        }
        if (!row.STNM && info.data.stnm) {
          row.STNM = info.data.stnm
        }
      }
    } catch (e) {
      console.warn('queryStcdInfo failed', e)
    }

    // 该站当日数据 → 填充弹窗「实时信息」卡片；无数据则回退到该站最新有数据日
    try {
      const day: any = await queryStcdDailyRange({ stcd, startDate: wt, endDate: wt })
      let rows: any[] = day?.data?.rows || []
      if (!rows.length) {
        const back: any = await queryStcdDailyRange({
          stcd,
          startDate: backoffDay(wt, 240),
          endDate: wt
        })
        const list: any[] = back?.data?.rows || []
        if (list.length) {
          wt = String(list[list.length - 1].DT || '').substring(0, 10)
          rows = [list[list.length - 1]]
          row.TM = wt
          mapStationWt.value = wt
        }
      }
      const r: any = rows[0]
      if (r) {
        row.qyzt = r.Q
        row.awqyzt = r.AWQ
        row.zyzt = r.Z
        row.wyzt = r.W
        row.dayqyzt = r.DAY_Q
      }
    } catch (e) {
      console.warn('queryStcdDailyRange failed', e)
    }

    mapStationRow.value = row
    mapStationWt.value = wt
    mapStationShow.value = true
  }

  return { mapStationShow, mapStationRow, mapStationWt, onMapNodeClick, resolveWtTime, todayStr }
}
