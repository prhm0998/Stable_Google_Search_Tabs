import useUserData from "@/composables/useUserData";
import { waitElement } from "@1natsu/wait-element";
import { sleep } from "@prhm0998/shared/utils";
import { watch } from "vue";

export async function useGoogleStableTabs(): Promise<void> {
  const { state } = useUserData();

  const menuContainer = await waitElement("div.beZ0tf.O1uzAe");
  if (!menuContainer) return;

  await sleep(10); // userDataの読み込み待機

  watch(
    () => state.value.order_list,
    async (newOrderList) => {
      if (!Array.isArray(newOrderList) || newOrderList.length === 0) return;

      const listItems = menuContainer.querySelectorAll<HTMLDivElement>('[role="listitem"]');
      if (!listItems.length) return;

      const listItemsArray = Array.from(listItems);

      for (let i = newOrderList.length - 1; i >= 0; i--) {
        const expectedText = newOrderList[i];
        const itemToMove = listItemsArray.find(item => item.textContent?.trim() === expectedText);
        if (itemToMove) menuContainer.prepend(itemToMove);
      }
    },
    { immediate: true, deep: true }
  );
}
