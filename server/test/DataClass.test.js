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
} = require('nem2-sdk');
const async = require('async');
const Data = require('../DataClass');

const networkType = NetworkType.TEST_NET;

let signature, publicKey, hash, signedTransaction, cosignatureSignedTransaction;

beforeAll(() => {
    const serverAccount = Account.createFromPrivateKey(
        process.env.PRIVATE_KEY,
        networkType
    );
    const userAccount = Account.createFromPrivateKey(
        'C604F0AE90295D7311F9F78EBDC2D91D22861CC843E58266221DB06F784D1FCB',
        networkType
    );
    const transferTransaction = TransferTransaction.create(
        Deadline.create(),
        Account.generateNewAccount(networkType).address,
        [new Mosaic(new MosaicId(process.env.MOSAIC_ID), UInt64.fromUint(1))],
        PlainMessage.create(''),
        networkType
    );
    const dummyTransaction = TransferTransaction.create(
        Deadline.create(),
        Account.generateNewAccount(networkType).address,
        [new Mosaic(new MosaicId(process.env.MOSAIC_ID), UInt64.fromUint(0))],
        PlainMessage.create(''),
        networkType
    );
    const aggregateTransaction = AggregateTransaction.createComplete(
        Deadline.create(),
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

test('instance', (done) => {
    let data;
    async.waterfall([
        (callback) => {
            data = new Data(`test/db/test-${Date.now()}`);
            data.initialize(callback);
        },
        (callback) => {
            expect(data).toBeInstanceOf(Data);
            callback();
        },
        (callback) => {
            data.close(callback);
        }
    ], done);
});

test('save & load', (done) => {
    let data;
    async.waterfall([
        (callback) => {
            data = new Data(`test/db/test-${Date.now()}`);
            data.initialize(callback);
        },
        (callback) => {
            data.save(signedTransaction, callback)
        },
        (callback) => {
            data.load(hash, callback);
        },
        (signedTransaction, callback) => {
            expect(signedTransaction).toBeInstanceOf(SignedTransaction);
            expect(signedTransaction).toHaveProperty('hash', expect.any(String));
            expect(signedTransaction).toHaveProperty('payload', expect.any(String));
            expect(signedTransaction).toHaveProperty('type', expect.any(Number));
            expect(signedTransaction).toHaveProperty('networkType', expect.any(Number));
            expect(signedTransaction).toHaveProperty('signerPublicKey', expect.any(String));
            callback();
        },
        (callback) => {
            data.close(callback);
        }
    ], done);
});


test('load', (done) => {
    let data;
    async.waterfall([
        (callback) => {
            data = new Data(`test/db/test-${Date.now()}`);
            data.initialize(callback);
        },
        async.reflect((callback) => {
            data.save(signedTransaction, callback)
        }),
        (result, callback) => {
            expect(result).toMatchObject({});
            callback();
        },
        (callback) => {
            data.close(callback);
        }
    ], done);
});


test('save', (done) => {
    let data;
    async.waterfall([
        (callback) => {
            data = new Data(`test/db/test-${Date.now()}`);
            data.initialize(callback);
        },
        async.reflect((callback) => {
            data.load(hash, callback);
        }),
        (signedTransaction, callback) => {
            expect(signedTransaction).not.toBeInstanceOf(SignedTransaction);
            callback();
        },
        (callback) => {
            data.close(callback);
        }
    ], done);
});
