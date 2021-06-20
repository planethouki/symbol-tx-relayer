const {
    Account,
    AggregateTransaction,
    CosignatureTransaction,
    Deadline,
    Mosaic,
    MosaicId,
    NetworkType,
    PlainMessage,
    SignedTransaction,
    TransactionAnnounceResponse,
    TransactionType,
    TransferTransaction,
    UInt64
} = require('symbol-sdk');

const networkType = NetworkType.TEST_NET;
const epochAdjustment = 1616694977;
const mosaicId = "091F837E059AE13C";
const privateKey = "25B3F54217340F7061D02676C4B928ADB4395EB70A2A52D2A11E2F4AE011B03E";
const generationHash = "3B5E1FA6445653C971A50687E75E6D09FB30481055E3990C84B25E9222DC1155";
const restUrl = "https://dg0nbr5d1ohfy.cloudfront.net:443";

let signature, publicKey, parentHash, signedTransaction, cosignatureSignedTransaction;

const serverAccount = Account.createFromPrivateKey(
    privateKey,
    networkType
);
const userAccount = Account.createFromPrivateKey(
    'C604F0AE90295D7311F9F78EBDC2D91D22861CC843E58266221DB06F784D1FCB',
    networkType
);
const transferTransaction = TransferTransaction.create(
    Deadline.create(epochAdjustment),
    Account.generateNewAccount(networkType).address,
    [new Mosaic(new MosaicId(mosaicId), UInt64.fromUint(1))],
    PlainMessage.create(''),
    networkType
);
const dummyTransaction = TransferTransaction.create(
    Deadline.create(epochAdjustment),
    Account.generateNewAccount(networkType).address,
    [new Mosaic(new MosaicId(mosaicId), UInt64.fromUint(0))],
    PlainMessage.create(''),
    networkType
);
const aggregateTransaction = AggregateTransaction.createComplete(
    Deadline.create(epochAdjustment),
    [
        transferTransaction.toAggregate(userAccount.publicAccount),
        dummyTransaction.toAggregate(serverAccount.publicAccount)
    ],
    networkType,
    [],
    UInt64.fromUint(50000)
);
signedTransaction = serverAccount.signTransactionWithCosignatories(
    aggregateTransaction,
    [],
    generationHash
);
cosignatureSignedTransaction = CosignatureTransaction.signTransactionPayload(
    userAccount,
    signedTransaction.payload,
    generationHash
);
signature = cosignatureSignedTransaction.signature;
publicKey = cosignatureSignedTransaction.signerPublicKey;
parentHash = cosignatureSignedTransaction.parentHash;

module.exports = {
    networkType,
    epochAdjustment,
    mosaicId,
    privateKey,
    generationHash,
    restUrl,
    signature,
    publicKey,
    parentHash,
    signedTransaction,
    cosignatureSignedTransaction
}
