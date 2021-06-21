const expect = require('chai').expect;
const symbolSdk = require('symbol-sdk');
const {
    Account,
    Deadline,
    Mosaic,
    MosaicId,
    NetworkType,
    PlainMessage,
    TransferTransaction,
    UInt64
} = symbolSdk;
const Network = require('../NetworkClass');
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

describe('NetworkClass', () => {

    describe('constructor', () => {
        it('valid', () => {
            const network = new Network(restUrl);
            expect(network).to.be.instanceOf(Network);
        });
        it('invalid', () => {
            expect(() => {
                const network = new Network();
            }).to.be.throw();
        });
    });

    it('fetch to be promise', () => {
        const network = new Network(restUrl);
        expect(network.fetch()).to.be.instanceOf(Promise);
    });

    it('fetch', async () => {
        const network = new Network(restUrl);
        await network.fetch();
        expect(network).to.have.property('networkType');
        expect(network).to.have.property('epochAdjustment');
        expect(network).to.have.property('mosaicId');
        expect(network).to.have.property('generationHash');
        expect(network.networkType).to.equal(networkType);
        expect(Number.isInteger(network.epochAdjustment)).to.be.true;
        expect(network.epochAdjustment).to.equal(epochAdjustment);
        expect(network.mosaicId).to.equal(mosaicId);
        expect(network.generationHash.length).to.equal(64);
        expect(network.generationHash).to.equal(generationHash);
    })

});
