"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorType = exports.ErrorGettingAllOwnedNFTsInfo = exports.ErrorGettingNFTInfo = exports.ErrorGettingCollections = exports.ErrorInvalidArg = exports.ErrorAPIQuery = exports.ErrorInvalidAddress = exports.ErrorInvalidRange = exports.ErrorInvalidPrivateKey = exports.ErrorInvalidSeed = exports.ErrorInvalidMnemnoic = exports.ErrorGeneric = exports.ErrorSDKAuthService = exports.ErrorSDKAuthInitialization = exports.ErrorSDKInitialization = void 0;
class ErrorSDKInitialization extends Error {
}
exports.ErrorSDKInitialization = ErrorSDKInitialization;
class ErrorSDKAuthInitialization extends Error {
}
exports.ErrorSDKAuthInitialization = ErrorSDKAuthInitialization;
class ErrorSDKAuthService extends Error {
}
exports.ErrorSDKAuthService = ErrorSDKAuthService;
class ErrorGeneric extends Error {
}
exports.ErrorGeneric = ErrorGeneric;
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
class ErrorAPIQuery extends Error {
}
exports.ErrorAPIQuery = ErrorAPIQuery;
class ErrorInvalidArg extends Error {
}
exports.ErrorInvalidArg = ErrorInvalidArg;
class ErrorGettingCollections extends Error {
}
exports.ErrorGettingCollections = ErrorGettingCollections;
class ErrorGettingNFTInfo extends Error {
}
exports.ErrorGettingNFTInfo = ErrorGettingNFTInfo;
class ErrorGettingAllOwnedNFTsInfo extends Error {
}
exports.ErrorGettingAllOwnedNFTsInfo = ErrorGettingAllOwnedNFTsInfo;
exports.errorType = {
    ErrorSDKInitialization: 'SDK not initialized properly',
    ErrorSDKAuthInitialization: 'initAuth method should be called before connect method',
    ErrorSDKAuthService: 'Please Provide valid Authentication Service',
    ErrorGeneric: 'Something went wrong. Please try again',
    ErrorChainId: 'Swap on this network is not supported',
};
