const { NetworkType } = require('symbol-sdk');

const networkType = NetworkType.TEST_NET;
const epochAdjustment = 123456789;
const mosaicId = "091F837E059AE13C";
const privateKey = "25B3F54217340F7061D02676C4B928ADB4395EB70A2A52D2A11E2F4AE011B03E";
const generationHash = "45FBCF2F0EA36EFA7923C9BC923D6503169651F7FA4EFC46A8EAF5AE09057EBD";

module.exports = {
    networkType,
    epochAdjustment,
    mosaicId,
    privateKey,
    generationHash
}
