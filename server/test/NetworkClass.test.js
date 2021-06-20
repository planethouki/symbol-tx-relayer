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
        const result = await network.fetch();
        expect(result).to.have.property('networkType');
        expect(result).to.have.property('epochAdjustment');
        expect(result).to.have.property('mosaicId');
        expect(result).to.have.property('generationHash');
        expect(result.networkType).to.equal(networkType);
        expect(Number.isInteger(result.epochAdjustment)).to.be.true;
        expect(result.epochAdjustment).to.equal(epochAdjustment);
        expect(result.mosaicId).to.equal(mosaicId);
        expect(result.generationHash.length).to.equal(64);
        expect(result.generationHash).to.equal(generationHash);
    })

});
