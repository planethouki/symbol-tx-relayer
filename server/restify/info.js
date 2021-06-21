const async = require('async');
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
                res.send(result);
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
