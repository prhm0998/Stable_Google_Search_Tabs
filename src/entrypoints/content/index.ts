import useUserData from "@/composables/useUserData";
import { waitElement } from "@1natsu/wait-element";

export default defineContentScript({
  "matches": [
    /**
      [Note: In many cases, it may work in your country simply by targeting the URL.]
      Step 1. Check that Google displays correctly when accessed from your country, then uncomment the corresponding line.
      Step 2. Add a locales/[country code].yml file (refer to the other YML files already included in the source).
    */
    "https://www.google.co.jp/", //日本
    "https://www.google.com/", //アメリカ
    //"https://www.google.co.uk/", //イギリス
    //"https://www.google.de/", //ドイツ
    //"https://www.google.fr/", //フランス
    //"https://www.google.it/", //イタリア
    //"https://www.google.es/", //スペイン
    //"https://www.google.ca/", //カナダ（英語）
    //"https://www.google.ca/?hl=fr", //カナダ（フランス語）
    //"https://www.google.com.au/", //オーストラリア
    //"https://www.google.co.nz/", //ニュージーランド
    //"https://www.google.co.in/", //インド
    //"https://www.google.com.hk/", //中国（香港）
    //"https://www.google.com.tw/", //台湾
    //"https://www.google.co.kr/", //韓国
    //"https://www.google.ru/", //ロシア
    //"https://www.google.com.br/", //ブラジル
    //"https://www.google.com.mx/", //メキシコ
    //"https://www.google.nl/", //オランダ
    //"https://www.google.be/?hl=fr", //ベルギー（フランス語）
    //"https://www.google.be/?hl=nl", //ベルギー（オランダ語）
    //"https://www.google.se/", //スウェーデン
    //"https://www.google.no/", //ノルウェー
    //"https://www.google.dk/", //デンマーク
    //"https://www.google.pl/", //ポーランド
    //"https://www.google.cz/", //チェコ
    //"https://www.google.gr/", //ギリシャ
    //"https://www.google.com.tr/", //トルコ
    //"https://www.google.com.ar/", //アルゼンチン
    //"https://www.google.cl/", //チリ
    //"https://www.google.com.co/", //コロンビア
    //"https://www.google.com.pe/", //ペルー
    //"https://www.google.co.za/", //南アフリカ

  ],
  main() {
    const { state } = useUserData()


    fixMenu()

    async function fixMenu(): Promise<void> {
      const menuContainer = await waitElement("div.beZ0tf.O1uzAe")
      if (!menuContainer) return;

      // userDataの読み込みに時間がかかるので待機 1msで良いが念の為10ms
      await sleep(10)

      const listItems = menuContainer.querySelectorAll<HTMLDivElement>('[role="listitem"]')
      if (!listItems.length) return // listItemsが空の場合はここで処理を終了

      // listItemsを扱いやすい配列に変換
      const listItemsArray = Array.from(listItems);


      // 1. 設定したlist配列を**後ろから順番に**処理します
      for (let i = state.value.order_list.length - 1; i >= 0; i--) {
        const expectedText = state.value.order_list[i];

        // 2. listItemsArrayの中から、テキストが一致する要素を探します
        const itemToMove = listItemsArray.find(item => {
          // item.textContentが存在し、list_jpの要素と一致するかを確認
          return item.textContent && item.textContent.trim() === expectedText;
        });

        // 3. 一致する要素が見つかった場合
        if (itemToMove) {
          // menuContainerの**先頭**に移動（追加）します
          // prepend()を使うと、要素はmenuContainerの既存の子要素の前に移動します。
          menuContainer.prepend(itemToMove);
        }
      }
    }
  },
});
