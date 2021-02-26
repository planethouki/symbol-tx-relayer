<template>
  <div class="container">
    <section>
      <h1>Symbol Transaction Relayer Client Sample</h1>
      <p>トランザクション手数料を肩代わりするサービスを使ったサンプルクライアント。</p>

      <b-button to="/metadata" variant="primary">Get started</b-button>
    </section>

    <section class="mt-5">
      <h4>クライアント情報</h4>
      <div>使用ノード {{ linkNodeUrl }}</div>
      <div>使用ノード {{ fetchNodeUrl }}</div>
    </section>

    <section class="mt-5">
      <h4>サーバー情報</h4>
      <div>使用ノード {{ info.restUrl }}</div>
      <div>代理署名アドレス {{ info.signAddress }}</div>
      <div>ジェネレーションハッシュ {{ info.generationHash }}</div>
      <div>手数料モザイクID {{ info.mosaicId }}</div>
    </section>

    <section class="mt-5">
      <a
        target="_blank"
        href="https://github.com/planethouki/symbol-tx-relayer">
        GitHub
      </a>
    </section>
  </div>
</template>

<script>

export default {
  data () {
    return {
      info: {
        mosaicId: 'fetching...',
        restUrl: 'fetching...',
        generationHash: 'fetching...',
        signAddress: 'fetching...'
      }
    }
  },
  computed: {
    linkNodeUrl () {
      return process.env.LINK_NODE_URL
    },
    fetchNodeUrl () {
      return process.env.FETCH_NODE_URL
    }
  },
  mounted () {
    fetch(`${process.env.SERVER_URL}/info`, {
      mode: 'cors',
      cache: 'no-cache'
    })
      .then(r => r.json())
      .then((info) => {
        this.info = info
      })
  }
}
</script>
