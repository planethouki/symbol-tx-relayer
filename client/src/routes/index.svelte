<script>
    import { Button } from 'sveltestrap'
    import { link } from 'svelte-spa-router'

    export const name = 'Home'
</script>

<svelte:head>
    <title>Home</title>
</svelte:head>

<h1>Symbol Transaction Relayer Client Sample</h1>
<p>トランザクション手数料を肩代わりするサービスを使ったサンプルクライアント。</p>

<a class="btn btn-primary" href="/metadata" use:link>Go</a>
