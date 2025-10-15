import useUserData from "@/composables/useUserData";
import { waitElement } from "@1natsu/wait-element";

export default defineContentScript({
  "matches": [
    /**
      [Note: In many cases, it may work in your country simply by targeting the URL.]
      Step 1. Check that Google displays correctly when accessed from your country, then uncomment the corresponding line.
      Step 2. Add a locales/[country code].yml file (refer to the other YML files already included in the source).
    */
    "*://www.google.co.jp/*", //日本
    "*://www.google.com/*", //アメリカ
    //"*://www.google.co.uk/*", //イギリス
    //"*://www.google.de/*", //ドイツ
    //"*://www.google.fr/*", //フランス
    //"*://www.google.it/*", //イタリア
    //"*://www.google.es/*", //スペイン
    //"*://www.google.ca/*", //カナダ（英語）
    //"*://www.google.ca/?hl=fr", //カナダ（フランス語）
    //"*://www.google.com.au/*", //オーストラリア
    //"*://www.google.co.nz/*", //ニュージーランド
    //"*://www.google.co.in/*", //インド
    //"*://www.google.com.hk/*", //中国（香港）
    //"*://www.google.com.tw/*", //台湾
    //"*://www.google.co.kr/*", //韓国
    //"*://www.google.ru/*", //ロシア
    //"*://www.google.com.br/*", //ブラジル
    //"*://www.google.com.mx/*", //メキシコ
    //"*://www.google.nl/*", //オランダ
    //"*://www.google.be/?hl=fr", //ベルギー（フランス語）
    //"*://www.google.be/?hl=nl", //ベルギー（オランダ語）
    //"*://www.google.se/*", //スウェーデン
    //"*://www.google.no/*", //ノルウェー
    //"*://www.google.dk/*", //デンマーク
    //"*://www.google.pl/*", //ポーランド
    //"*://www.google.cz/*", //チェコ
    //"*://www.google.gr/*", //ギリシャ
    //"*://www.google.com.tr/*", //トルコ
    //"*://www.google.com.ar/*", //アルゼンチン
    //"*://www.google.cl/*", //チリ
    //"*://www.google.com.co/*", //コロンビア
    //"*://www.google.com.pe/*", //ペルー
    //"*://www.google.co.za/*", //南アフリカ

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


      // 1. 設定したlist配列を後ろから順番に処理します
      for (let i = state.value.order_list.length - 1; i >= 0; i--) {
        const expectedText = state.value.order_list[i];

        // 2. listItemsArrayの中から、テキストが一致する要素を探します
        const itemToMove = listItemsArray.find(item => {
          // item.textContentが存在し、listの要素と一致するかを確認
          return item.textContent && item.textContent.trim() === expectedText;
        });

        // 3. 一致する要素が見つかった場合
        if (itemToMove) {
          // menuContainerの先頭に移動（追加）します
          // prepend()を使うと、要素はmenuContainerの既存の子要素の前に移動します。
          menuContainer.prepend(itemToMove);
        }
      }
    }
  },
});
