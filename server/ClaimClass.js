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
} = require('symbol-sdk');

module.exports = class Claim {

    networkType;
    requestBodyObject;
    transaction;
    from;
    signedTransaction;
    generationHash;
    privateKey;
    epochAdjustment;
    mosaicId;

    constructor(requestBodyObject, privateKey, generationHash, epochAdjustment, mosaicId, networkType) {
        this.privateKey = privateKey;
        this.generationHash = generationHash;
        this.epochAdjustment = epochAdjustment;
        this.mosaicId = mosaicId;
        this.networkType = networkType;
        this.requestBodyObject = requestBodyObject;

        // validate
        let isValid = this.requestBodyObject.hasOwnProperty('transaction');
        isValid = isValid && this.requestBodyObject.hasOwnProperty('publicKey');
        isValid = isValid && privateKey !== undefined;
        isValid = isValid && generationHash !== undefined;
        isValid = isValid && epochAdjustment !== undefined;
        isValid = isValid && mosaicId !== undefined;
        isValid = isValid && networkType !== undefined;

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
        const signer = Account.createFromPrivateKey(this.privateKey, this.networkType);
        const dummyTransaction = TransferTransaction.create(
            Deadline.create(this.epochAdjustment),
            Account.generateNewAccount(this.networkType).address,
            [new Mosaic(new MosaicId(this.mosaicId), UInt64.fromUint(0))],
            PlainMessage.create(''),
            this.networkType
        );
        const aggregateTransaction = AggregateTransaction.createComplete(
            Deadline.create(this.epochAdjustment),
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
            this.generationHash
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
