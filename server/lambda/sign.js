const async = require('async');
const Sign = require('../SignClass');

module.exports = (data) => (req, next) => {
    try {
        let parentHash;
        const sign = new Sign(req.body);
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
                Sign
                    .send(sign.cosignedTransaction)
                    .subscribe((announce) => {
                        callback(null, announce);
                    });
            }
        ], next)
    } catch (e) {
        console.error(e);
        next(500);
    }
}
