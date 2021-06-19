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
    generationHash;
    privateKey;

    /**
     *
     * @param requestBodyObject
     * @param privateKey
     * @param generationHash
     */
    constructor(requestBodyObject, privateKey, generationHash) {
        this.requestBodyObject = requestBodyObject;

        // validate
        let isValid = this.requestBodyObject.hasOwnProperty('signature');
        isValid = isValid && this.requestBodyObject.hasOwnProperty('publicKey');
        isValid = isValid && this.requestBodyObject.hasOwnProperty('parentHash');
        isValid = isValid && privateKey !== undefined;
        isValid = isValid && generationHash !== undefined;

        if (!isValid) {
            throw new Error();
        }

        this.generationHash = generationHash;
        this.privateKey = privateKey;

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
        const signer = Account.createFromPrivateKey(this.privateKey, this.networkType);
        this.cosignedTransaction = signer.signTransactionGivenSignatures(
            transaction,
            [
                new CosignatureSignedTransaction(
                    this.parentHash,
                    this.signature,
                    this.from.publicKey
                )
            ],
            this.generationHash
        );
        return this;
    }

}
