import {
    Account,
    AccountMetadataTransaction,
    Convert,
    Deadline,
    NetworkType,
    KeyGenerator,
    KeyPair,
    RepositoryFactoryHttp,
    SHA3Hasher,
} from "nem2-sdk";

import { of } from 'rxjs';
import { catchError, mergeMap } from "rxjs/operators";

const config = require('../../config.json');

const networkType = NetworkType.TEST_NET;
const serverUrl = config.serverUrl;
const nodeUrl = config.nodeUrl;

/**
 *
 * @param {String} privateKey
 * @param {String} metadataKey
 * @param {String} metadataValue
 * @return {Promise<{announceResponse: *, transactionHash: {String}}>}
 */
export default (privateKey, metadataKey, metadataValue) => {
    const signSchema = SHA3Hasher.resolveSignSchema(networkType);
    const account = Account.createFromPrivateKey(privateKey, networkType);
    const metadataValueBytes = Convert.utf8ToUint8(metadataValue);

    const repositoryFactory = new RepositoryFactoryHttp(nodeUrl);
    const metadataHttp = repositoryFactory.createMetadataRepository();

    let transactionHash;
    let announceResponse;

    return metadataHttp
        .getAccountMetadataByKeyAndSender(
            account.address,
            KeyGenerator.generateUInt64Key(metadataKey).toHex(),
            account.publicKey)
        .pipe(
            mergeMap((metadata) => {
                const currentValueBytes = Convert.utf8ToUint8(metadata.metadataEntry.value);
                // console.log(currentValueBytes);
                return of(AccountMetadataTransaction.create(
                    Deadline.create(),
                    account.publicKey,
                    KeyGenerator.generateUInt64Key(metadataKey),
                    metadataValueBytes.length - currentValueBytes.length,
                    Convert.decodeHex(Convert.xor(currentValueBytes, metadataValueBytes)),
                    networkType,
                ));
            }),
            catchError((err) => {
                return of(AccountMetadataTransaction.create(
                    Deadline.create(),
                    account.publicKey,
                    KeyGenerator.generateUInt64Key(metadataKey),
                    metadataValue.length,
                    metadataValue,
                    networkType
                ))
            })
        )
        .toPromise()
        .then((accountMetadataTransaction) => {
            return fetch(`${serverUrl}/claim`, {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
                body: JSON.stringify({
                    publicKey: account.publicKey,
                    transaction: accountMetadataTransaction.toJSON()
                })
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
            return fetch(`${serverUrl}/sign`, {
                method: 'POST',
                mode: 'cors',
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
