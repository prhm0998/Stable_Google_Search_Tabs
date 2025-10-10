// useDragDrop.ts
export function useDragDrop(options?: {
  onSwap?: (from: number, to: number) => void
  onRemove?: (index: number) => void
}) {
  const startIndex = ref<number | null>(null)
  const endIndex = ref<number | null>(null)
  const dragLeaveEnterCounter = ref(0)
  const dragLeaveCounter = ref(0)

  const start = (index: number) => {
    startIndex.value = index
  }

  const drop = (index: number) => {
    if (startIndex.value === null) return
    if (startIndex.value === index) return
    endIndex.value = index
  }

  const end = () => {
    if (startIndex.value === null) return
    if (dragLeaveEnterCounter.value === 0 && dragLeaveCounter.value > 1) {
      options?.onRemove?.(startIndex.value)
    } else {
      if (endIndex.value !== null) {
        options?.onSwap?.(startIndex.value, endIndex.value)
      }
    }
    reset()
  }

  const dragLeaveParent = () => {
    dragLeaveEnterCounter.value--
    dragLeaveCounter.value++
  }

  const dragEnterParent = () => {
    dragLeaveEnterCounter.value++
  }

  const reset = () => {
    startIndex.value = null
    endIndex.value = null
    dragLeaveEnterCounter.value = 0
    dragLeaveCounter.value = 0
  }

  return {
    // 状態
    startIndex,
    endIndex,
    dragLeaveEnterCounter,
    dragLeaveCounter,
    // イベントハンドラ
    start,
    drop,
    end,
    dragLeaveParent,
    dragEnterParent,
    reset,
  }
}
