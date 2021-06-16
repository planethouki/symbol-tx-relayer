# symbol-tx-relayer

https://planethouki.github.io/symbol-tx-relayer/

トランザクションを代理送信します。

`/claim`にトランザクションデータと公開鍵を送信します。
アグリゲートコンプリートトランザクションでラップして
サーバーの秘密鍵で署名したデータを返してきます。

`/sign`にコシグネチャートランザクションを送信します。
サーバーがブロックチェーンに送信します。

testnet(0.10.0.7)に対応しています。

## ローカルで動かす

1. `server`と`client`にある`.env.sample`を`.env`にリネームする
2. `server`に`cd`して`npm dev`
3. `client`に`cd`して`npm dev`
4. ブラウザで`http://localhost:3000`にアクセス

## AWS Lambdaで動かす

### Server

1. `server`にある`.env.sample`を`.env`にリネームする
2. `.env`の`S3_BUCKET_NAME`と`S3_KEY_PREFIX`を設定する
3. s3バケットを作成する
4. lambdaを作成してs3にアクセス権を設定する
5. `server`フォルダごとlambdaにデプロイする。RuntimeはNode.js 14.xとか。
6. lambdaのHandlerを`lambda.handler`にする
7. lambdaのTimeoutを10s程度にする
8. api-gatewayを作成してRouteを作成する。`/server/{type+}`とかにする
9. api-gatewayのRouteにlambda統合する
10. api-gatewayのCORSを有効にする

### Client

1. `client`にある`.env.sample`を`.env`にリネームする
2. `.env`の`SERVER_URL`をapi-gatewayのURLにする。`https://xxx.execute-api.region.amazonaws.com/server`とか。
3. `client`に`cd`して`npm run generate`
4. `dist`フォルダをどこかでホストする

`https`でホストした場合は、`FETCH_NODE_URL`は`https`でなければならない

## todo

- [ ] 1.0.x.0 testnet compatible
- [ ] node info display 
