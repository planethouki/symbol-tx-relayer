const async = require('async');
const Claim = require('./ClaimClass');

module.exports = (data) => (req, res, next) => {
    try {
        const hash = {}, signedTransaction = {};
        async.waterfall([
            (callback) => {
                new Claim(req.body)
                    .createRelayAggregateTransaction()
                    .save(signedTransaction)
                    .hash(hash);
                callback();
            },
            (callback) => {
                data
                    .save(signedTransaction, callback);
            },
            (callback) => {
                res.header('location', '/sign');
                res.send(302, {hash});
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
