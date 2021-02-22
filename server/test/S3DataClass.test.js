const expect = require('chai').expect;
require('dotenv').config();
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
const async = require('async');
const Data = require('../S3DataClass');

const networkType = NetworkType.TEST_NET;
const epochAdjustment = 123456789;

let signature, publicKey, hash, signedTransaction, cosignatureSignedTransaction;

before(() => {
    const serverAccount = Account.createFromPrivateKey(
        process.env.PRIVATE_KEY,
        networkType
    );
    const userAccount = Account.createFromPrivateKey(
        'C604F0AE90295D7311F9F78EBDC2D91D22861CC843E58266221DB06F784D1FCB',
        networkType
    );
    const transferTransaction = TransferTransaction.create(
        Deadline.create(epochAdjustment),
        Account.generateNewAccount(networkType).address,
        [new Mosaic(new MosaicId(process.env.MOSAIC_ID), UInt64.fromUint(1))],
        PlainMessage.create(''),
        networkType
    );
    const dummyTransaction = TransferTransaction.create(
        Deadline.create(epochAdjustment),
        Account.generateNewAccount(networkType).address,
        [new Mosaic(new MosaicId(process.env.MOSAIC_ID), UInt64.fromUint(0))],
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
        process.env.GENERATION_HASH
    );
    cosignatureSignedTransaction = CosignatureTransaction.signTransactionPayload(
        userAccount,
        signedTransaction.payload,
        process.env.GENERATION_HASH
    );
    signature = cosignatureSignedTransaction.signature;
    publicKey = cosignatureSignedTransaction.signerPublicKey;
    hash = cosignatureSignedTransaction.parentHash;
});

it('instance', (done) => {
    let data;
    async.waterfall([
        (callback) => {
            data = new Data('hoge');
            data.initialize(callback);
        },
        (callback) => {
            expect(data).to.be.an.instanceOf(Data);
            callback();
        }
    ], done);
});
