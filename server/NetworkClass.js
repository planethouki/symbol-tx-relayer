const {
    Account,
    AggregateTransaction,
    Deadline,
    Mosaic,
    MosaicId,
    NetworkType,
    PlainMessage,
    PublicAccount,
    TransactionMapping,
    TransferTransaction,
    UInt64,
    RepositoryFactoryHttp
} = require('symbol-sdk');

module.exports = class Network {

    restUrl;

    constructor(restUrl) {
        // validate
        let isValid = restUrl !== undefined;

        if (!isValid) {
            throw new Error();
        }

        this.restUrl = restUrl;
    }

    fetch() {
        const factory = new RepositoryFactoryHttp(this.restUrl);
        const gets = [
            factory.getNetworkType().toPromise(),
            factory.getEpochAdjustment().toPromise(),
            factory.getCurrencies().toPromise(),
            factory.getGenerationHash().toPromise()
        ]
        return Promise
            .all(gets)
            .then(([networkType, epochAdjustment, currencies, generationHash]) => {
                return {
                    networkType,
                    epochAdjustment,
                    mosaicId: currencies.currency.mosaicId.toHex(),
                    generationHash
                }
            })
    }

}
