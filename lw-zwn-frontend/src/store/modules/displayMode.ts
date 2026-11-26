import { defineStore } from 'pinia'
import { reactive } from 'vue'

import type { StoreDefinition } from 'pinia'

interface DisplayMode {
  mode: 'auto' | 'freedom'
  scale: number
}
export const useDisplayMode: StoreDefinition = defineStore(
  'display-mode',
  () => {
    const state = reactive<DisplayMode>({
      mode: 'auto',
      scale: 1
    })
    return { state }
  },
  {
    persist: true
  }
)
