const AWS = require('aws-sdk');
const { SignedTransaction } = require('nem2-sdk');

module.exports = class Data {

    s3;
    name;

    /**
     *
     * @param {String} name s3 bucket name
     */
    constructor(name) {
        this.s3 = new AWS.S3({apiVersion: '2006-03-01'});
        this.name = name;
    }

    /**
     *
     * @param {Function} callback callback(err)
     */
    initialize(callback) {
        callback(null);
    }

    /**
     *
     * @param {SignedTransaction} signedTransaction
     * @param {Function} callback callback(err)
     */
    save(signedTransaction, callback) {
        this.s3.putObject({
            Bucket: this.name,
            Key: signedTransaction.hash,
            Body: JSON.stringify(signedTransaction)
        }, (err, result) => {
            callback(err)
        })
    }

    /**
     *
     * @param {String} hash
     * @param {Function} callback callback(err, signedTransaction)
     */
    load(hash, callback) {
        this.s3.getObject({
            Bucket: this.name,
            Key: hash
        }, (err, data) => {
            const raw = JSON.parse(data.Body);
            const signedTransaction = new SignedTransaction(
                raw.payload,
                raw.hash,
                raw.signerPublicKey,
                raw.type,
                raw.networkType
            );
            callback(err, signedTransaction);
        });
    }

    /**
     *
     * @param callback
     */
    close(callback) {

    }

}
