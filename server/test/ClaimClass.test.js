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
    mosaicId,
    privateKey,
    generationHash
} = require('./testEnv');

describe('ClaimClass', () => {

    let transaction;
    let publicKey;

    before(() => {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(epochAdjustment),
            Account.generateNewAccount(networkType).address,
            [new Mosaic(new MosaicId(mosaicId), UInt64.fromUint(1))],
            PlainMessage.create(''),
            networkType
        );
        transaction = transferTransaction.toJSON();
        const userAccount = Account.generateNewAccount(networkType);
        publicKey = userAccount.publicKey;
    });

    describe('constructor', () => {
        it('valid', () => {
            const claim = new Claim({
                transaction,
                publicKey
            }, privateKey, generationHash, epochAdjustment, mosaicId, networkType);
            expect(claim).to.be.an.instanceOf(Claim);
        })
        it('invalid1', () => {
            expect(() => {
                const claim = new Claim({
                    transaction
                }, privateKey, generationHash, epochAdjustment, mosaicId);
            }).to.throw();
        });
        it('invalid2', () => {
            expect(() => {
                const claim = new Claim({
                    transaction,
                    publicKey
                }, privateKey, generationHash, epochAdjustment, mosaicId);
            }).to.throw();
        });
    });

    it('createRelayAggregateTransaction', () => {
        const claim = new Claim({
            transaction,
            publicKey
        }, privateKey, generationHash, epochAdjustment, mosaicId, networkType);
        const result = claim.createRelayAggregateTransaction();
        expect(result).to.be.instanceOf(Claim);
    });

    it('save', () => {
        const claim = new Claim({
            transaction,
            publicKey
        }, privateKey, generationHash, epochAdjustment, mosaicId, networkType);
        const result = claim.createRelayAggregateTransaction().save({});
        expect(result).to.be.instanceOf(Claim);
    });

});
