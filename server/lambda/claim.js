const async = require('async');
const Claim = require('../ClaimClass');
const Network = require('../NetworkClass');

module.exports = (data) => (req, next) => {
    const signedTransaction = {};
    let network;
    async.waterfall([
        (callback) => {
            network = new Network(process.env.REST_URL)
            network.fetch().then(() => {
                callback();
            }).catch((err) => {
                callback(err);
            });
        },
        (callback) => {
            const claim = new Claim(
                req.body,
                process.env.PRIVATE_KEY,
                network.generationHash,
                network.epochAdjustment,
                network.mosaicId,
                network.networkType);
            claim
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
