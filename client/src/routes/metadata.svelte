<script>
    import { Button, Form, FormGroup, FormText, Input, Label } from 'sveltestrap';
    import send from '../lib/send';

    export const name = 'metadata';

    let privateKey = "E4E48DAF7CC2F7E99818490D4F3DB9D14D7D58078D59FC99DB6B944A098BF9BC";
    let metadataKey = "";
    let metadataValue = "";

    let sending = Promise.resolve();

    let hashes = [], announces = [];

    function handleClick(event) {
        sending = send(privateKey, metadataKey, metadataValue)
            .then(({transactionHash, announceResponse}) => {
                hashes = [...hashes, transactionHash];
                announces = [...announces, announceResponse];
            })
    }
</script>

<svelte:head>
    <title>Metadata</title>
</svelte:head>

<h1>メタデータを作成する</h1>
<p>あなたのアカウントにメタデータを作成します。</p>

<Form>
    <FormGroup>
        <Label for="inputPrivateKey">Private Key</Label>
        <Input
                type="text"
                name="privateKey"
                id="inputPrivateKey"
                bind:value={privateKey}
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
            <Button disabled>Go</Button>
        {:then _}
            <Button on:click={handleClick}>Go</Button>
        {/await}
    </FormGroup>
</Form>

<ul>
{#each hashes as hash}
    <li>
        <a href={`https://test-api.48gh23s.xyz:3001/transaction/${hash}/status`} target="_blank">{hash}</a>
    </li>
{/each}
</ul>
