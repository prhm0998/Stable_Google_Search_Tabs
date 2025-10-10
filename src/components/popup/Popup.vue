<script lang="ts" setup>
import { useDragDrop } from '@/composables/useDragDrop';

const userInput = ref('')
const { state, updateUserData } = useUserData()
const { start, drop, end, dragLeaveParent, dragEnterParent } = useDragDrop({
  onSwap: (from, to) => swap(from, to),
  onRemove: (index) => remove(index)
})

const add = () => {
  if (!validateUserInput.value) return
  updateUserData({ type: 'add', key: 'order_list', value: userInput.value })
  userInput.value = ""
}
const swap = (from: number, to: number) => {
  const newOrderList = [...state.value.order_list];
  const [removed] = newOrderList.splice(from, 1); // fromの位置から要素を一つ削除し、その要素を取得
  newOrderList.splice(to, 0, removed); // toの位置に削除した要素を挿入
  updateUserData({ type: 'update', key: 'order_list', value: newOrderList })
}

const remove = (index: number) => {
  const newOrderList = [...state.value.order_list];
  newOrderList.splice(index, 1);
  updateUserData({ type: 'update', key: 'order_list', value: newOrderList })
}

const validateUserInput = computed(() => {
  if (!userInput?.value) return false
  //if (!isValidRegex(userInput.value)) return false
  return true
})

</script>

<template>
  <div class=" h-[420px] w-[520px]">
    <div class="mt-4 flex items-center justify-center">
      <input id="userInput" ref="inputRef" v-model="userInput" :placeholder="`Enter Menu Text`" type="text"
        class="bg-gray-100 block border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:border-blue-500 dark:focus:ring-blue-500 dark:placeholder-gray-400 dark:text-gray-400 flex-1 focus:border-blue-500 focus:ring-blue-500 mb-2 mx-2 p-2.5 rounded-lg text-gray-900 text-sm w-full"
        @keydown.enter="add" />
      <button type="button" :disabled="!validateUserInput"
        class="border border-gray-800 dark:border-gray-600 dark:disabled:border-gray-700 dark:focus:ring-gray-800 dark:hover:bg-gray-600 dark:hover:text-white dark:text-gray-400 disabled:cursor-not-allowed disabled:shadow-none disabled:text-gray-500 enabled:hover:bg-blue-400 enabled:hover:text-white focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium h-8 mb-2 me-2 px-5 rounded-lg text-blue-500 text-xs"
        @click="add"> {{ i18n.t('popup.dialog.button.submit') }}
      </button>
    </div>
    <div class="listView flex flex-wrap gap-1 bg-amber-50 p-2" @dragover.prevent="" @dragleave.prevent="dragLeaveParent"
      @dragenter.prevent="dragEnterParent">
      <template v-for="(item, index) in state.order_list" :key="index">
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