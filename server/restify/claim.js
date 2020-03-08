const async = require('async');
const Claim = require('../ClaimClass');

module.exports = (data) => (req, res, next) => {
    try {
        const signedTransaction = {};
        async.waterfall([
            (callback) => {
                new Claim(req.body)
                    .createRelayAggregateTransaction()
                    .save(signedTransaction);
                callback();
            },
            (callback) => {
                data
                    .save(signedTransaction, callback);
            },
            (callback) => {
                res.send(signedTransaction);
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
