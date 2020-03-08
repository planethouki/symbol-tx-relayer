const async = require('async');
const Claim = require('../ClaimClass');

module.exports = (data) => (req, next) => {
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
            callback(null, resBody);
        }
    ], next);
}
