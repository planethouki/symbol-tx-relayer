require('dotenv').config();
const async = require('async');
const Data = require('./S3DataClass');
const claimRoute = require('./lambda/claim');
const signRoute = require('./lambda/sign');
const infoRoute = require('./lambda/info');

exports.handler = (event, context, done) => {
    try {
        if (event.requestContext.http.method === 'OPTIONS')
        {
            return done();
        }
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
                } else if (event.rawPath.includes('info')) {
                    infoRoute()({}, callback)
                } else {
                    callback(true);
                }
            }
        ], done);
    } catch (e) {
        console.log(event);
        console.error(e);
        done(e);
    }
};
