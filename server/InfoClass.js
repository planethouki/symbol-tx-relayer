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

module.exports = class Info {

    privateKey;
    networkType;

    constructor(privateKey, networkType) {
        // validate
        let isValid = privateKey !== undefined;

        if (!isValid) {
            throw new Error();
        }

        this.privateKey = privateKey;
        this.networkType = networkType;
    }

    getInfo() {
        const account = Account.createFromPrivateKey(this.privateKey, this.networkType);
        return {
            signAddress: account.address.plain()
        }
    }

}
