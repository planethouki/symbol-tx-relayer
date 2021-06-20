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
    generationHash,
    restUrl,
    signature,
    publicKey,
    parentHash,
    signedTransaction,
    cosignatureSignedTransaction
} = require('./testEnv');

describe('DataClass', () => {

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
                data.load(parentHash, callback);
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
                data.load(parentHash, callback);
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

})
