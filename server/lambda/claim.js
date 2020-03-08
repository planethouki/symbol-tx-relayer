const async = require('async');
const Claim = require('../ClaimClass');

module.exports = (data) => (req, next) => {
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
            callback(null, signedTransaction);
        }
    ], next);
}
