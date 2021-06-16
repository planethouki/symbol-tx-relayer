const expect = require('chai').expect;
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
const Data = require('../DataClass');

const {
    networkType,
    epochAdjustment,
    mosaicId,
    privateKey,
    generationHash
} = require('./testEnv');

let signature, publicKey, hash, signedTransaction, cosignatureSignedTransaction;

before(() => {
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
    hash = cosignatureSignedTransaction.parentHash;
});

it('instance', (done) => {
    let data;
    async.waterfall([
        (callback) => {
            data = new Data(`test/db/test-${Date.now()}`);
            data.initialize(callback);
        },
        (callback) => {
            expect(data).to.be.an.instanceOf(Data);
            callback();
        },
        (callback) => {
            data.close(callback);
        }
    ], done);
});

it('save & load', (done) => {
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
            expect(signedTransaction).to.be.an.instanceOf(SignedTransaction);
            expect(signedTransaction).to.have.property('hash').that.is.a('string');
            expect(signedTransaction).to.have.property('payload').that.is.a('string');
            expect(signedTransaction).to.have.property('type').that.is.a('number');
            expect(signedTransaction).to.have.property('networkType').that.is.a('number');
            expect(signedTransaction).to.have.property('signerPublicKey').that.is.a('string');
            callback();
        },
        (callback) => {
            data.close(callback);
        }
    ], done);
});


it('load', (done) => {
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
            expect(result).to.deep.equal({});
            callback();
        },
        (callback) => {
            data.close(callback);
        }
    ], done);
});


it('save', (done) => {
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
            expect(signedTransaction).not.to.be.instanceof(SignedTransaction);
            callback();
        },
        (callback) => {
            data.close(callback);
        }
    ], done);
});
