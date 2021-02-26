const async = require('async');
const Data = require('./S3DataClass');
const claimRoute = require('./lambda/claim');
const signRoute = require('./lambda/sign');

exports.handler = (event, context, done) => {
    try {
        let data;
        async.waterfall([
            (callback) => {
                data = new Data(process.env.S3_BUCKET_NAME, process.env.S3_KEY_PREFIX);
                data.initialize(callback);
            },
            (callback) => {
                if (event.rawPath.includes('claim')) {
                    claimRoute(data)({body: JSON.parse(event.body)}, callback)
                } else if (event.rawPath.includes('sign')) {
                    signRoute(data)({body: JSON.parse(event.body)}, callback)
                } else {
                    callback(true);
                }
            }
        ], done);
    } catch (e) {
        console.error(e);
        done(e);
    }
};
