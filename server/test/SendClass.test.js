const expect = require('chai').expect;
const { TransactionAnnounceResponse } = require('symbol-sdk');
const Sign = require('../SignClass');
const Send = require('../SendClass');

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

describe('SendClass', () => {

    it('send', async () => {
        const sign = new Sign({
            signature,
            publicKey,
            parentHash
        }, privateKey, generationHash);
        sign
            .addSignedTransaction(signedTransaction)
            .concatCosignature();
        const send = new Send(sign.cosignedTransaction, restUrl);
        await send
            .send()
            .toPromise()
            .then((res) => {
                console.log(res);
                expect(res).to.be.an.instanceOf(TransactionAnnounceResponse)
            });
    });

});
