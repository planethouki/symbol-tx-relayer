const async = require('async');
const Claim = require('../ClaimClass');

module.exports = (data) => (req, res, next) => {
    try {
        const resBody = {}, signedTransaction = {};
        async.waterfall([
            (callback) => {
                new Claim(req.body)
                    .createRelayAggregateTransaction()
                    .save(signedTransaction)
                    .hash(resBody);
                callback();
            },
            (callback) => {
                data
                    .save(signedTransaction, callback);
            },
            (callback) => {
                res.send(resBody);
                next();
                callback();
            }
        ]);
    } catch (e) {
        console.error(e);
        res.send(500);
        next();
    }
}
