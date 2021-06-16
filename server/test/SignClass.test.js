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
const mosaicId = "091F837E059AE13C";
const privateKey = "25B3F54217340F7061D02676C4B928ADB4395EB70A2A52D2A11E2F4AE011B03E";
const generationHash = "45FBCF2F0EA36EFA7923C9BC923D6503169651F7FA4EFC46A8EAF5AE09057EBD";

let signature, publicKey, parentHash, signedTransaction, cosignatureSignedTransaction;

describe('SignClass', () => {

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
