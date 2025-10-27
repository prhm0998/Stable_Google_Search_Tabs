<script lang="ts" setup>
import { useDragDrop } from '@prhm0998/shared/composables'

const userInput = ref('')
const { state, updateState } = useUserData()
const { start, drop, end, dragLeaveParent, dragEnterParent } = useDragDrop({
  onSwap: (from, to) => swap(from, to),
  onRemove: (index) => remove(index)
})

function updateOrderList(updater: (list: string[]) => string[]) {
  const newList = updater([...state.value.order_list])
  updateState({ type: 'update', key: 'order_list', value: newList })
}

const add = () => {
  if (!isValidInput.value) return
  updateState({ type: 'add', key: 'order_list', value: userInput.value })
  userInput.value = ''
}

const swap = (from: number, to: number) =>
  updateOrderList(list => {
    const [item] = list.splice(from, 1)
    list.splice(to, 0, item)
    return list
  })

const remove = (index: number) =>
  updateOrderList(list => {
    list.splice(index, 1)
    return list
  })

const isValidInput = computed(() => !!userInput.value.trim())

</script>

<template>
  <div class=" h-[420px] w-[520px]">
    <div class="mt-4 flex items-center justify-center">
      <input id="userInput" ref="inputRef" v-model="userInput" autocomplete="off" :placeholder="`Enter Menu Text`"
        type="text"
        class="bg-gray-100 block border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:border-blue-500 dark:focus:ring-blue-500 dark:placeholder-gray-400 dark:text-gray-400 flex-1 focus:border-blue-500 focus:ring-blue-500 mb-2 mx-2 p-2.5 rounded-lg text-gray-900 text-sm w-full"
        @keydown.enter="add" />
      <button type="button" :disabled="!isValidInput"
        class="border border-gray-800 dark:border-gray-600 dark:disabled:border-gray-700 dark:focus:ring-gray-800 dark:hover:bg-gray-600 dark:hover:text-white dark:text-gray-400 disabled:cursor-not-allowed disabled:shadow-none disabled:text-gray-500 enabled:hover:bg-blue-400 enabled:hover:text-white focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium h-8 mb-2 me-2 px-5 rounded-lg text-blue-500 text-xs"
        @click="add"> {{ i18n.t('popup.dialog.button.submit') }}
      </button>
    </div>
    <div class="listView flex flex-wrap gap-1 bg-amber-50 p-2" @dragover.prevent @dragleave.prevent="dragLeaveParent"
      @dragenter.prevent="dragEnterParent">
      <template v-for="(item, index) in state.order_list" :key="item">
        <div class="btn" draggable="true" @dragstart="start(index)" @drop.prevent="drop(index)" @dragend="end">{{
          item }}</div>
      </template>
    </div>
    <div class="text-gray-600 text-xs mb-2 px-2">
      - {{ i18n.t('popup.help.row1') }}<br>
      - {{ i18n.t('popup.help.row2') }}<br>
      - {{ i18n.t('popup.help.row3') }}
    </div>
  </div>
</template>

<style scoped></style>