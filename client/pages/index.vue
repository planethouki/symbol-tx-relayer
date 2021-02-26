<template>
  <div class="container">
    <section>
      <h1>Symbol Transaction Relayer Client Sample</h1>
      <p>トランザクション手数料を肩代わりするサービスを使ったサンプルクライアント。</p>

      <b-button to="/metadata" variant="primary">Get started</b-button>
    </section>

    <section class="mt-5">
      <div>使用ノード {{ nodeUrl }}</div>
    </section>
  </div>
</template>

<script>

export default {
  computed: {
    nodeUrl () {
      return process.env.NODE_URL
    }
  }
}
</script>
