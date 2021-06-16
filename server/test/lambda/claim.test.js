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
} = require('symbol-sdk');
const claimRoute = require('../../lambda/claim');

const networkType = NetworkType.TEST_NET;

const data = {
    save(signedTransaction, callback) {
        callback(null)
    }
}

test('transaction', () => {
    const body = {
        "transaction": {
            "transaction":{"type":16724,"network":152,"version":38913,"maxFee":"0","deadline":"8954807077","signature":"","recipientAddress":{"address":"TAVZFM5O2437PCW7MDYTE23LCCYTOUB73P7LRWXD","networkType":152},"mosaics":[{"amount":"1","id":"51A99028058245A8"}],"message":{"type":0,"payload":""}}
        },
        "publicKey": "19C08117B826E6F155FC28FF4261912ACB7343572E935180B070EA8FD8404DCB"
    }
    claimRoute(data)({body}, (err, result) => {
        console.log(err, result)
    })
});
