require('dotenv').config();
const {
    Account,
    Deadline,
    Mosaic,
    MosaicId,
    NetworkType,
    PlainMessage,
    TransactionType,
    TransferTransaction,
    UInt64
} = require('nem2-sdk');
const Claim = require('../ClaimClass');

const networkType = NetworkType.TEST_NET;

test('transaction', () => {
    const userAccount = Account.generateNewAccount(networkType);
    const transferTransaction = TransferTransaction.create(
        Deadline.create(),
        Account.generateNewAccount(networkType).address,
        [new Mosaic(new MosaicId(process.env.MOSAIC_ID), UInt64.fromUint(1))],
        PlainMessage.create(''),
        networkType
    );
    const jsonObject = transferTransaction.toJSON();
    const claim = new Claim({
        transaction: jsonObject,
        publicKey: userAccount.publicKey
    });
    expect(claim).toBeInstanceOf(Claim);
});
