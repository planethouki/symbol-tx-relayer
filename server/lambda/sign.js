const async = require('async');
const Sign = require('../SignClass');
const Send = require('../SendClass');

module.exports = (data) => (req, next) => {
    let parentHash;
    const sign = new Sign(req.body, process.env.PRIVATE_KEY, process.env.GENERATION_HASH);
    const send = new Send(sign.cosignedTransaction, process.env.REST_URL);
    async.waterfall([
        (callback) => {
            parentHash = sign.parentHash;
            callback();
        },
        (callback) => {
            data
                .load(parentHash, callback);
        },
        (signedTransaction, callback) => {
            sign
                .addSignedTransaction(signedTransaction)
                .concatCosignature();
            callback();
        },
        (callback) => {
            send
                .send(sign.cosignedTransaction)
                .subscribe((announce) => {
                    callback(null, announce);
                });
        }
    ], next)
}
