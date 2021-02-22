const {
    Account,
    AggregateTransaction,
    CosignatureSignedTransaction,
    Deadline,
    Mosaic,
    MosaicId,
    NetworkType,
    PlainMessage,
    PublicAccount,
    SignedTransaction,
    Transaction,
    TransactionAnnounceResponse,
    TransactionHttp,
    TransactionMapping,
    TransferTransaction,
    UInt64
} = require('symbol-sdk');

module.exports = class Sign {

    networkType = NetworkType.TEST_NET;
    requestBodyObject;
    signature;
    parentHash;
    from;
    signedTransaction;
    cosignedTransaction;

    constructor(requestBodyObject) {
        this.requestBodyObject = requestBodyObject;

        // validate
        const isValid = this.requestBodyObject.hasOwnProperty('signature')
            && this.requestBodyObject.hasOwnProperty('publicKey')
            && this.requestBodyObject.hasOwnProperty('parentHash');
        if (!isValid) {
            throw new Error();
        }

        // mapping
        this.signature = this.requestBodyObject.signature;
        this.parentHash = this.requestBodyObject.parentHash;
        this.from = PublicAccount.createFromPublicKey(
            this.requestBodyObject.publicKey,
            this.networkType
        );
    }

    /**
     *
     * @param {SignedTransaction} signedTransaction
     */
    addSignedTransaction(signedTransaction) {
        this.signedTransaction = signedTransaction;
        return this;
    }

    concatCosignature() {
        const transaction = TransactionMapping.createFromPayload(this.signedTransaction.payload);
        const signer = Account.createFromPrivateKey(process.env.PRIVATE_KEY, this.networkType);
        this.cosignedTransaction = signer.signTransactionGivenSignatures(
            transaction,
            [
                new CosignatureSignedTransaction(
                    this.parentHash,
                    this.signature,
                    this.from.publicKey
                )
            ],
            process.env.GENERATION_HASH
        );
        return this;
    }

    /**
     *
     * @param signedTransaction
     * @return {Observable<TransactionAnnounceResponse>}
     */
    static send(signedTransaction) {
        const transactionHttp = new TransactionHttp(process.env.REST_URL);
        return transactionHttp.announce(signedTransaction);
    }


}
