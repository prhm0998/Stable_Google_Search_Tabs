import { useDebounceFn } from '@vueuse/core'

export interface UserData {
  order_list: string[]
}

export type UserDataEvent =
  | { type: 'update', key: keyof UserData, value: string[] }
  | { type: 'add', key: keyof UserData, value: string }
  | { type: 'remove', key: keyof UserData, value: string }


const getDefaultUserData = (): UserData => ({
  order_list: JSON.parse(i18n.t("default.list"))
})

export default function () {
  const defaultUserData = getDefaultUserData()
  const { state: storedJson } = useStoredValue('local:data', '{}')
  const memoryCache = ref<UserData>(defaultUserData)

  // json to state
  const deserialize = (jsonString: string): UserData => {
    try {
      const parsed = JSON.parse(jsonString) as Partial<UserData>
      // 不要なプロパティを削除
      const filterd = filterProperties(parsed, defaultUserData)
      // jsonにないプロパティはデフォルトから持ってくる
      return applyDefaultProperties(filterd, defaultUserData)
    }
    catch {
      return getDefaultUserData()
    }
  }

  // state to json 後はstringifyするだけの状態に加工する
  const serialize = (): UserData => {
    return memoryCache.value
  }

  // ストアに更新があったらキャッシュも更新する
  const initializeCache = () => memoryCache.value = deserialize(storedJson.value)
  watch(storedJson, (newVal) => memoryCache.value = deserialize(newVal))
  initializeCache()

  const saveToStorage = useDebounceFn(() => {
    storedJson.value = JSON.stringify(serialize())
  }, 100, { maxWait: 1000 })

  const updateUserData = (event: UserDataEvent) => {
    const { type, key, value } = event
    switch (type) {
      case 'update':
        if (key === 'order_list') {
          memoryCache.value[key] = value
        }
        break
      case 'add':
        if (key === 'order_list') {
          memoryCache.value[key].push(value)
        }
        break
      case 'remove':
        if (key === 'order_list') {
          memoryCache.value[key] = memoryCache.value[key].filter(m => m !== value)
        }
      default:
        break
    }
    saveToStorage()
  }
  return {
    state: (memoryCache),
    updateUserData,
  }
}