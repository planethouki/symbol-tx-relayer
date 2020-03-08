import {
    Account,
    NetworkType,
    RepositoryFactoryHttp,
} from "nem2-sdk";

import { of } from 'rxjs';
import { catchError } from "rxjs/operators";

const config = require('../../config.json');

const networkType = NetworkType.TEST_NET;
const nodeUrl = config.nodeUrl;

/**
 *
 * @param {String} privateKey
 * @return {Promise<String[]>}
 */
export default (privateKey) => {

    const account = Account.createFromPrivateKey(privateKey, networkType);
    const repositoryFactory = new RepositoryFactoryHttp(nodeUrl);
    const metadataHttp = repositoryFactory.createMetadataRepository();

    return metadataHttp.getAccountMetadata(account.address)
        .pipe(catchError((err) => {
            return of([])
        }))
        .toPromise()
        .then((metadata) => {
            return metadata
                .map((entry) => {
                    const metadataEntry = entry.metadataEntry;
                    return {
                        key: metadataEntry.scopedMetadataKey.toHex().toUpperCase(),
                        value: metadataEntry.value,
                        senderPublicKey: metadataEntry.senderPublicKey,
                        targetPublicKey: metadataEntry.targetPublicKey
                    }
                });
        })
}
