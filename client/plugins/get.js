import {
  Account,
  NetworkType,
  RepositoryFactoryHttp
} from 'symbol-sdk'

import { of } from 'rxjs'
import { catchError } from 'rxjs/operators'

const networkType = NetworkType.TEST_NET
const nodeUrl = process.env.NODE_URL

/**
 *
 * @param {String} privateKey
 * @return {Promise<String[]>}
 */
const func = (privateKey) => {
  const account = Account.createFromPrivateKey(privateKey, networkType)
  const repositoryFactory = new RepositoryFactoryHttp(nodeUrl)
  const metadataHttp = repositoryFactory.createMetadataRepository()
  return metadataHttp.search({ sourceAddress: account.address })
    // eslint-disable-next-line node/handle-callback-err
    .pipe(catchError((err) => {
      return of([])
    }))
    .toPromise()
    .then((metadata) => {
      return metadata
        .data
        .map((entry) => {
          const metadataEntry = entry.metadataEntry
          return {
            metadataKey: metadataEntry.scopedMetadataKey.toHex().toUpperCase(),
            metadataValue: metadataEntry.value,
            sourceAddress: metadataEntry.sourceAddress.address,
            targetAddress: metadataEntry.targetAddress.address
          }
        })
    })
}

export default ({ app }, inject) => {
  inject('get', func)
}
