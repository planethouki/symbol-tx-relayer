const async = require('async');
const Sign = require('../SignClass');
const Send = require('../SendClass');

module.exports = (data) => (req, res, next) => {
    try {
        let parentHash, sign, send, network;
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
                sign = new Sign(req.body, process.env.PRIVATE_KEY, network.generationHash);
                send = new Send(sign.cosignedTransaction, process.env.REST_URL);
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
                        console.log(announce);
                        res.send(announce);
                        next();
                        callback();
                    });
            }
        ])

    } catch (e) {
        console.error(e);
        res.send(500);
    } finally {
        next();
    }
}
