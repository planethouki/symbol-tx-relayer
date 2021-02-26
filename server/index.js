require('dotenv').config();
const restify = require('restify');
const async = require('async');
const corsMiddleware = require('restify-cors-middleware');

const claimRoute = require('./restify/claim');
const signRoute = require('./restify/sign');

const Data = require('./DataClass');
let data;

const cors = corsMiddleware({
    origins: ['*'],
});

const server = restify.createServer();
server.use(restify.plugins.bodyParser());
server.pre(cors.preflight);
server.use(cors.actual);

server.get('/info', (req, res, next) => {
    res.json({
        mosaicId: process.env.MOSAIC_ID,
        restUrl: process.env.REST_URL,
        generationHash: process.env.GENERATION_HASH,
        signAddress: process.env.SIGN_ADDRESS
    });
});

async.waterfall([
    (callback) => {
        data = new Data(':memory:');
        data.initialize(callback);
    },
    (callback) => {
        server.post('/claim', claimRoute(data));
        server.post('/sign', signRoute(data));
        callback();
    },
    (callback) => {
        server.listen(8765, () => {
            console.log('%s listening at %s', server.name, server.url);
            callback();
        });
    }
]);


server.on('close', () => {
    data.close();
});
