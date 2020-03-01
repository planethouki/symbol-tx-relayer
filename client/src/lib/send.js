import {
    Account,
    AccountMetadataTransaction,
    Convert,
    Deadline,
    NetworkType,
    KeyGenerator,
    KeyPair,
    SHA3Hasher,
} from "nem2-sdk";

const networkType = NetworkType.TEST_NET;

export default (privateKey, metadataKey, metadataValue) => {
    const signSchema = SHA3Hasher.resolveSignSchema(networkType);
    const account = Account.createFromPrivateKey(privateKey, networkType);
    const targetPublicKey = account.publicKey;

    let transactionHash;
    let announceResponse;

    const accountMetadataTransaction = AccountMetadataTransaction.create(
        Deadline.create(),
        targetPublicKey,
        KeyGenerator.generateUInt64Key(metadataKey),
        metadataValue.length,
        metadataValue,
        networkType
    );

    return fetch('http://localhost:8765/claim', {
        method: 'POST',
        cache: 'no-cache',
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
            publicKey: targetPublicKey,
            transaction: accountMetadataTransaction.toJSON()
        })
    })
        .then(res => res.json())
        .then(({hash}) => {
            transactionHash = hash;
            const keyPair = KeyPair.createKeyPairFromPrivateKeyString(privateKey, signSchema);
            const signature = Convert.uint8ToHex(KeyPair.sign(keyPair, Convert.hexToUint8(hash), signSchema));
            return {
                signature,
                publicKey: account.publicKey,
                parentHash: hash
            }
        })
        .then((body) => {
            return fetch('http://localhost:8765/sign', {
                method: 'POST',
                cache: 'no-cache',
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
                body: JSON.stringify(body)
            })
        })
        .then(res => res.json())
        .then((res) => {
            announceResponse = res
        })
        .then(() => {
            return {
                transactionHash,
                announceResponse
            }
        })

}
