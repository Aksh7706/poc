"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorType = exports.ErrorInvalidArg = exports.ErrorAPIQuery = exports.ErrorGeneric = exports.ErrorGettingAllOwnedNFTsInfo = exports.ErrorGettingNFTInfo = exports.ErrorGettingCollections = exports.ErrorInvalidAddress = exports.ErrorInvalidRange = exports.ErrorInvalidPrivateKey = exports.ErrorInvalidSeed = exports.ErrorInvalidMnemnoic = exports.ErrorSDKAuthService = exports.ErrorSDKAuthInitialization = exports.ErrorSDKInitialization = void 0;
class ErrorSDKInitialization extends Error {
}
exports.ErrorSDKInitialization = ErrorSDKInitialization;
class ErrorSDKAuthInitialization extends Error {
}
exports.ErrorSDKAuthInitialization = ErrorSDKAuthInitialization;
class ErrorSDKAuthService extends Error {
}
exports.ErrorSDKAuthService = ErrorSDKAuthService;
class ErrorInvalidMnemnoic extends Error {
}
exports.ErrorInvalidMnemnoic = ErrorInvalidMnemnoic;
class ErrorInvalidSeed extends Error {
}
exports.ErrorInvalidSeed = ErrorInvalidSeed;
class ErrorInvalidPrivateKey extends Error {
}
exports.ErrorInvalidPrivateKey = ErrorInvalidPrivateKey;
class ErrorInvalidRange extends Error {
}
exports.ErrorInvalidRange = ErrorInvalidRange;
class ErrorInvalidAddress extends Error {
}
exports.ErrorInvalidAddress = ErrorInvalidAddress;
class ErrorGettingCollections extends Error {
}
exports.ErrorGettingCollections = ErrorGettingCollections;
class ErrorGettingNFTInfo extends Error {
}
exports.ErrorGettingNFTInfo = ErrorGettingNFTInfo;
class ErrorGettingAllOwnedNFTsInfo extends Error {
}
exports.ErrorGettingAllOwnedNFTsInfo = ErrorGettingAllOwnedNFTsInfo;
class ErrorGeneric extends Error {
    constructor(err) {
        super(JSON.stringify(err));
    }
}
exports.ErrorGeneric = ErrorGeneric;
class ErrorAPIQuery extends Error {
    constructor(err) {
        super(JSON.stringify({ reason: 'API_FAILURE', explanation: err }));
    }
}
exports.ErrorAPIQuery = ErrorAPIQuery;
class ErrorInvalidArg extends Error {
    constructor(err) {
        super(JSON.stringify({ reason: 'INVALID_PAYLOAD', explanation: err }));
    }
}
exports.ErrorInvalidArg = ErrorInvalidArg;
exports.errorType = {
    ErrorSDKInitialization: 'SDK not initialized properly',
    ErrorSDKAuthInitialization: 'initAuth method should be called before connect method',
    ErrorSDKAuthService: 'Please Provide valid Authentication Service',
    ErrorGeneric: 'Something went wrong. Please try again',
    ErrorChainId: 'Swap on this network is not supported',
};
