import { onMounted, reactive, ref } from 'vue'

import type { Ref } from 'vue'

import type { ResponseSchema } from '@/utils/request/type'

interface IFetchProps {
  apiFun: () => Promise<ResponseSchema>
  isMounted?: boolean
  callback?: (data: any, loading: boolean, msg: string) => void
}

export default <T>(props: IFetchProps) => {
  const { apiFun, isMounted = false, callback } = props
  const data = ref<any | T>()
  const loading = ref<boolean>(false)
  const msg = ref<string>('')
  const loadData = () => {
    loading.value = true
    data.value = []
    apiFun()
      .then((res) => {
        loading.value = false
        data.value = res.data
        msg.value = res.message
        if (callback) {
          callback(data.value, loading.value, msg.value)
        }
        return res
      })
      .catch((error) => {
        loading.value = false
        data.value = []
        return Promise.reject(error)
      })
  }
  if (isMounted) {
    onMounted(() => {
      loadData()
    })
  } else {
    loadData()
  }

  return reactive<{ data: Ref<T>; loading: Ref<boolean> }>({
    data,
    loading
  })
}
