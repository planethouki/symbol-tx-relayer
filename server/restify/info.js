const async = require('async');
const Claim = require('../ClaimClass');
const Network = require('../NetworkClass');
const Info = require('../InfoClass');

module.exports = () => (req, res, next) => {
    try {
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
                const info = new Info(process.env.PRIVATE_KEY, network.networkType);
                const result = {
                    ...info.getInfo(),
                    restUrl: process.env.REST_URL
                }
                callback(null, result);
            }
        ]);
    } catch (e) {
        console.error(e);
        res.send(500);
        next();
    }
}
