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
const Sign = require('../SignClass');

const networkType = NetworkType.TEST_NET;
const epochAdjustment = 123456789;

let signature, publicKey, parentHash, signedTransaction, cosignatureSignedTransaction;

describe('SignClass', () => {

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
        parentHash = cosignatureSignedTransaction.parentHash;
    });

    it('instance', () => {
        const sign = new Sign({
            signature,
            publicKey,
            parentHash
        });
        expect(sign).to.be.an.instanceOf(Sign);
    });

    it('cosignature', async () => {
        const sign = new Sign({
            signature,
            publicKey,
            parentHash
        });
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
        });
        expect(sign.parentHash).to.equal(parentHash);
    });


    it('send', async () => {
        const sign = new Sign({
            signature,
            publicKey,
            parentHash
        });
        sign
            .addSignedTransaction(signedTransaction)
            .concatCosignature();
        await Sign
            .send(sign.cosignedTransaction)
            .toPromise()
            .then((res) => {
                console.log(res);
                expect(res).to.be.an.instanceOf(TransactionAnnounceResponse)
            });
    });

});
