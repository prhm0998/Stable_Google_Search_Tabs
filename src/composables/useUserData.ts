import { applyDefaultProperties, filterProperties } from '@prhm0998/shared/utils'
import { useGenericStore, type UpdateStateFn } from '@prhm0998/shared/composables'
import destr from 'destr'

export interface UserData {
  order_list: string[]
}

export type UserDataUpdateEvent =
  | { type: 'update', key: keyof UserData, value: string[] }
  | { type: 'add', key: keyof UserData, value: string }
  | { type: 'remove', key: keyof UserData, value: string }


const getDefaultState = (): UserData => ({
  order_list: destr(i18n.t("default.list"))
})

const deserialize = (jsonString: string): UserData => {
  try {
    const parsed = destr(jsonString) as Partial<UserData>
    const filterd = filterProperties(parsed, getDefaultState())
    return applyDefaultProperties(filterd, getDefaultState())
  }
  catch {
    return getDefaultState()
  }
}

const serialize = (cache: UserData) => JSON.stringify(cache)

const updateStateLogic: UpdateStateFn<UserData, UserDataUpdateEvent> = (state: Ref<UserData>, event: UserDataUpdateEvent) => {
  const { type, key, value } = event
  switch (type) {
    case 'update':
      if (key === 'order_list') {
        state.value[key] = value
      }
      break
    case 'add':
      if (key === 'order_list') {
        if (!state.value[key].includes(value)) {
          state.value[key].push(value)
        }
      }
      break
    case 'remove':
      if (key === 'order_list') {
        state.value[key] = state.value[key].filter(m => m !== value)
      }
    default:
      break
  }
}

export default function useUserData() {
  return useGenericStore<UserData, UserDataUpdateEvent>(
    'local:UserData',
    getDefaultState,
    deserialize,
    serialize,
    updateStateLogic
  )
}
