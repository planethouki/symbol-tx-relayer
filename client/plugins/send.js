import {
  Account,
  AccountMetadataTransaction,
  Convert,
  Deadline,
  NetworkType,
  KeyGenerator,
  KeyPair,
  RepositoryFactoryHttp
} from 'symbol-sdk'

import { of } from 'rxjs'
import { catchError, mergeMap } from 'rxjs/operators'

const networkType = NetworkType.TEST_NET
const serverUrl = process.env.SERVER_URL
const nodeUrl = process.env.NODE_URL

/**
 *
 * @param {String} privateKey
 * @param {String} metadataKey
 * @param {String} metadataValue
 * @return {Promise<{announceResponse: *, transactionHash: {String}}>}
 */
const func = async (privateKey, metadataKey, metadataValue) => {
  const account = Account.createFromPrivateKey(privateKey, networkType)
  const metadataValueBytes = Convert.utf8ToUint8(metadataValue)

  const repositoryFactory = new RepositoryFactoryHttp(nodeUrl)
  const metadataHttp = repositoryFactory.createMetadataRepository()

  let transactionHash
  let announceResponse

  const epochAdjustment = await repositoryFactory.getEpochAdjustment().toPromise()

  return metadataHttp
    .search({
      sourceAddress: account.address,
      scopedMetadataKey: KeyGenerator.generateUInt64Key(metadataKey).toHex()
    })
    .pipe(
      mergeMap((page) => {
        console.log(page)
        if (page.data.length === 0) { throw new Error('no metadata') }
        const metadata = page.data[0]
        const currentValueBytes = Convert.utf8ToUint8(metadata.metadataEntry.value)
        // console.log(currentValueBytes);
        return of(AccountMetadataTransaction.create(
          Deadline.create(epochAdjustment),
          account.address,
          KeyGenerator.generateUInt64Key(metadataKey),
          metadataValueBytes.length - currentValueBytes.length,
          Convert.decodeHex(Convert.xor(currentValueBytes, metadataValueBytes)),
          networkType
        ))
      }),
      // eslint-disable-next-line node/handle-callback-err
      catchError((err) => {
        return of(AccountMetadataTransaction.create(
          Deadline.create(epochAdjustment),
          account.address,
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
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({
          publicKey: account.publicKey,
          transaction: accountMetadataTransaction.toJSON()
        })
      })
    })
    .then(res => res.json())
    .then(({ hash }) => {
      transactionHash = hash
      const keyPair = KeyPair.createKeyPairFromPrivateKeyString(privateKey)
      const signature = Convert.uint8ToHex(KeyPair.sign(keyPair, Convert.hexToUint8(hash)))
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
          'Content-Type': 'application/json; charset=utf-8'
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

export default ({ app }, inject) => {
  inject('send', func)
}
