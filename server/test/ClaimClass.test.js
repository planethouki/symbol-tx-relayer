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
const Claim = require('../ClaimClass');

const {
    networkType,
    epochAdjustment,
    mosaicId
} = require('./testEnv');

describe('ClaimClass', () => {

    it('transaction', () => {
        const userAccount = Account.generateNewAccount(networkType);
        const transferTransaction = TransferTransaction.create(
            Deadline.create(epochAdjustment),
            Account.generateNewAccount(networkType).address,
            [new Mosaic(new MosaicId(mosaicId), UInt64.fromUint(1))],
            PlainMessage.create(''),
            networkType
        );
        const jsonObject = transferTransaction.toJSON();
        const claim = new Claim({
            transaction: jsonObject,
            publicKey: userAccount.publicKey
        });
        expect(claim).to.be.an.instanceOf(Claim);
    });

});
