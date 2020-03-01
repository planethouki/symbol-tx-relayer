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
    UInt64
} = require('nem2-sdk');

module.exports = class Claim {

    networkType;
    requestBodyObject;
    transaction;
    from;
    signedTransaction;

    constructor(requestBodyObject) {
        this.networkType = NetworkType.TEST_NET;
        this.requestBodyObject = requestBodyObject;

        // validate
        const isValid = this.requestBodyObject.hasOwnProperty('transaction')
            && this.requestBodyObject.hasOwnProperty('publicKey');
        if (!isValid) {
            throw new Error();
        }

        // mapping
        this.transaction = TransactionMapping.createFromDTO(
            this.requestBodyObject.transaction
        );
        this.from = PublicAccount.createFromPublicKey(
            this.requestBodyObject.publicKey,
            this.networkType
        );

    }

    /**
     *
     * @return {Claim}
     */
    createRelayAggregateTransaction() {
        const signer = Account.createFromPrivateKey(process.env.PRIVATE_KEY, this.networkType);
        const dummyTransaction = TransferTransaction.create(
            Deadline.create(),
            Account.generateNewAccount(this.networkType).address,
            [new Mosaic(new MosaicId(process.env.MOSAIC_ID), UInt64.fromUint(0))],
            PlainMessage.create(''),
            this.networkType
        );
        const aggregateTransaction = AggregateTransaction.createComplete(
            Deadline.create(),
            [
                this.transaction.toAggregate(this.from),
                dummyTransaction.toAggregate(signer.publicAccount)
            ],
            this.networkType,
            [],
            UInt64.fromUint(50000)
        );
        this.signedTransaction = signer.signTransactionWithCosignatories(
            aggregateTransaction,
            [],
            process.env.GENERATION_HASH
        );
        return this;
    }

    /**
     *
     * @param object
     * @return {Claim}
     */
    save(object) {
        Object.keys(this.signedTransaction)
            .forEach((key) => {
                object[key] = this.signedTransaction[key];
            });
        return this;
    }

    /**
     *
     * @param object
     * @return {Claim}
     */
    hash(object) {
        object.hash = this.signedTransaction.hash;
        return this;
    }

}
