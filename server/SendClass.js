const {
    TransactionHttp
} = require('symbol-sdk');

module.exports = class Send {

    signedTransaction;
    restUrl;

    /**
     *
     * @param signedTransaction
     * @param restUrl
     */
    constructor(signedTransaction, restUrl) {

        // validate
        let isValid = signedTransaction !== undefined;
        isValid = isValid && restUrl !== undefined;

        if (!isValid) {
            throw new Error();
        }

        this.signedTransaction = signedTransaction;
        this.restUrl = restUrl;
    }

    send() {
        const transactionHttp = new TransactionHttp(this.restUrl);
        return transactionHttp.announce(this.signedTransaction);
    }


}
