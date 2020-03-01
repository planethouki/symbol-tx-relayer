<script>
    import { Button, Form, FormGroup, Input, Label, Table, Toast, ToastBody, ToastHeader } from 'sveltestrap';
    import send from '../lib/send';
    import get from '../lib/get';
    import { privateKey } from '../stores.js';

    export const name = 'metadata';

    let toasts = [];

    let metadataKey = "";
    let metadataValue = "";

    let sending = Promise.resolve();
    let getting = Promise.resolve();

    let hashes = [], announces = [], metadata = [];

    function handleSend(event) {
        event.preventDefault();
        try {
            sending = send($privateKey, metadataKey, metadataValue)
                .then(({transactionHash, announceResponse}) => {
                    hashes = [...hashes, transactionHash];
                    announces = [...announces, announceResponse];
                })
        } catch(e) {
            toasts = [{
                isOpen: true,
                header: 'Error',
                body: e.message
            }, ...toasts]
        }
    }

    function handleGet(event) {
        event.preventDefault();
        metadata = [];
        try {
            getting = get($privateKey)
                .then((data) => {
                    metadata = data;
                })
        } catch(e) {
            toasts = [{
                isOpen: true,
                header: 'Error',
                body: e.message
            }, ...toasts]
        }
    }
</script>

<style>
    .public-key-ellipsis {
        font-family: Consolas, monospace;
        overflow: hidden;
        max-width: 5rem;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
</style>

<svelte:head>
    <title>Metadata</title>
</svelte:head>

<div class="position-fixed" style="right: 1rem; top: 1rem;">
    {#each toasts as toast}
        <Toast isOpen={toast.isOpen}>
            <ToastHeader toggle="{() => toast.isOpen = !toast.isOpen}" icon={"danger"}>
                {toast.header}
            </ToastHeader>
            <ToastBody>
                {toast.body}
            </ToastBody>
        </Toast>
    {/each}
</div>

<h1>メタデータを作成する</h1>
<p>あなたのアカウントにメタデータを作成します。手数料はかかりません。</p>

<Form>
    <FormGroup>
        <Label for="inputPrivateKey">Private Key</Label>
        <Input
                type="text"
                name="privateKey"
                id="inputPrivateKey"
                bind:value={$privateKey}
                placeholder="Test Private Key" />
    </FormGroup>
    <FormGroup>
        <Label for="inputMetadataKey">Metadata Key</Label>
        <Input
                type="text"
                name="metadataKey"
                id="inputMetadataKey"
                bind:value={metadataKey}
                placeholder="Metadata Key" />
    </FormGroup>
    <FormGroup>
        <Label for="inputMetadataValue">Metadata Value</Label>
        <Input
                type="text"
                name="metadataValue"
                id="inputMetadataValue"
                bind:value={metadataValue}
                placeholder="Metadata Value" />
    </FormGroup>
    <FormGroup>
        {#await sending}
            <Button disabled color="primary">メタデータを取得する</Button>
        {:then _}
            <Button on:click={handleGet} color="primary">メタデータを取得する</Button>
        {/await}
    </FormGroup>
    <FormGroup>
        {#await sending}
            <Button disabled color="danger">メタデータを設定する</Button>
        {:then _}
            <Button on:click={handleSend} color="danger">メタデータを設定する</Button>
        {/await}
    </FormGroup>
</Form>

<section class="mb-3">
    <h4>メタデータ</h4>
    {#if metadata.length === 0}
        <p>未取得もしくは未設定</p>
    {:else}
        <Table responsive size="sm">
            <thead>
            <tr>
                <th>Key</th>
                <th>Value</th>
                <th>Sender Public Key</th>
                <th>Target Public Key</th>
            </tr>
            </thead>
            <tbody>
            {#each metadata as m}
                <tr>
                    <th scope="row">{m.key}</th>
                    <td>{m.value}</td>
                    <td class="public-key-ellipsis">{m.senderPublicKey}</td>
                    <td class="public-key-ellipsis">{m.targetPublicKey}</td>
                </tr>
            {/each}
            </tbody>
        </Table>
    {/if}
</section>

<section class="mb-3">
    <h4>送信済みトランザクション</h4>
    <ul>
    {#each hashes as hash}
        <li>
            <a href={`https://test-api.48gh23s.xyz:3001/transaction/${hash}/status`} target="_blank">{hash}</a>
        </li>
    {/each}
    {#if hashes.length === 0}
        <li>なし</li>
    {/if}
    </ul>
</section>

