const expect = require('chai').expect;
const async = require('async');
const Data = require('../S3DataClass');

it('instance', (done) => {
    let data;
    async.waterfall([
        (callback) => {
            data = new Data('hoge', 'fuga');
            data.initialize(callback);
        },
        (callback) => {
            expect(data).to.be.an.instanceOf(Data);
            callback();
        }
    ], done);
});
