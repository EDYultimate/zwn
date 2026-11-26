import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDuty = defineStore(
  'duty',
  () => {
    const total_count = ref(0)
    const db_count = ref(0)
    const zytz_count = ref(0)
    const hsbs_count = ref(0)
    const xxbs_count = ref(0)
    const setTotalCount = (count: number) => {
      total_count.value = count
    }
    const setDbCount = (count: number) => {
      db_count.value = count
    }
    const setZytzCount = (count: number) => {
      zytz_count.value = count
    }
    const setHsbsCount = (count: number) => {
      hsbs_count.value = count
    }
    const setXxbsCount = (count: number) => {
      xxbs_count.value = count
    }
    return {
      total_count,
      db_count,
      setTotalCount,
      setDbCount,
      zytz_count,
      setZytzCount,
      hsbs_count,
      setHsbsCount,
      xxbs_count,
      setXxbsCount
    }
  },
  {}
)
