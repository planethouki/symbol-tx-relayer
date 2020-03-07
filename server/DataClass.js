const sqlite3 = require('sqlite3').verbose();
const async = require('async');
const { SignedTransaction } = require('nem2-sdk');

module.exports = class Data {

    db;
    name;

    /**
     *
     * @param {String} name database name
     */
    constructor(name) {
        this.name = name;
    }

    /**
     *
     * @param {Function} callback callback(err)
     */
    initialize(callback) {
        async.waterfall([
            (cb) => {
                this.db = new sqlite3.Database(this.name, cb);
            },
            (cb) => {
                this.db.run("CREATE TABLE IF NOT EXISTS transactions (hash TEXT, json TEXT)", cb);
            }
        ], callback);
    }

    /**
     *
     * @param {SignedTransaction} signedTransaction
     * @param {Function} callback callback(err)
     */
    save(signedTransaction, callback) {
        this.db.run(
            "INSERT INTO transactions VALUES (?, ?)",
            [signedTransaction.hash, JSON.stringify(signedTransaction)],
            callback
        )
    }

    /**
     *
     * @param {String} hash
     * @param {Function} callback callback(err, signedTransaction)
     */
    load(hash, callback) {
        this.db.all(
            "SELECT * FROM transactions WHERE hash = ?",
            [hash],
            (err, rows) => {
                if (rows.length === 0) {
                    return callback(true);
                }
                const raw = JSON.parse(rows[0].json);
                const signedTransaction = new SignedTransaction(
                    raw.payload,
                    raw.hash,
                    raw.signerPublicKey,
                    raw.type,
                    raw.networkType
                );
                callback(err, signedTransaction);
            }
        )
    }

    /**
     *
     * @param callback
     */
    close(callback) {
        this.db.close(callback);
    }

}
