const expect = require('chai').expect;
const { SignedTransaction } = require('symbol-sdk');
const Sign = require('../SignClass');

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

describe('SignClass', () => {

    it('instance', () => {
        const sign = new Sign({
            signature,
            publicKey,
            parentHash
        }, privateKey, generationHash);
        expect(sign).to.be.an.instanceOf(Sign);
    });

    it('validate', () => {
        expect(() => {
            new Sign({
                signature,
                publicKey,
                parentHash
            });
        }).to.throw();
        expect(() => {
            new Sign({
                signature,
                publicKey,
                parentHash
            }, privateKey);
        }).to.throw();
    });

    it('cosignature', async () => {
        const sign = new Sign({
            signature,
            publicKey,
            parentHash
        }, privateKey, generationHash);
        sign
            .addSignedTransaction(signedTransaction)
            .concatCosignature();
        expect(sign.cosignedTransaction).to.be.an.instanceOf(SignedTransaction);
    });

    it('parentHash', async () => {
        const sign = new Sign({
            signature,
            publicKey,
            parentHash
        }, privateKey, generationHash);
        expect(sign.parentHash).to.equal(parentHash);
    });

});
