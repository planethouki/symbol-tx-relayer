require('dotenv').config();
const restify = require('restify');
const async = require('async');
const corsMiddleware = require('restify-cors-middleware');

const claimRoute = require('./claim');
const signRoute = require('./sign');

const Data = require('./DataClass');
let data;

const cors = corsMiddleware({
    origins: ['*'],
});

const server = restify.createServer();
server.use(restify.plugins.bodyParser());
server.pre(cors.preflight);
server.use(cors.actual);

async.waterfall([
    (callback) => {
        data = new Data(':memory:', callback);
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
