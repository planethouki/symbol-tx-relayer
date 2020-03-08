# symbol-tx-relayer

トランザクションを代理送信します。

`/claim`にトランザクションデータと公開鍵を送信します。
アグリゲートコンプリートトランザクションでラップして
サーバーの秘密鍵で署名したデータを返してきます。

`/sign`にコシグネチャートランザクションを送信します。
サーバーがブロックチェーンに送信します。
