require('dotenv').config();
const async = require('async');
const Data = require('./S3DataClass');
const claimRoute = require('./lambda/claim');
const signRoute = require('./lambda/sign');

exports.handler = (event, context, done) => {
    try {
        if (event.requestContext.http.method === 'OPTIONS')
        {
            return done();
        }
        if (event.rawPath.includes('info')) {
            return done(null, {
                mosaicId: process.env.MOSAIC_ID,
                restUrl: process.env.REST_URL,
                generationHash: process.env.GENERATION_HASH,
                signAddress: process.env.SIGN_ADDRESS
            });
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
