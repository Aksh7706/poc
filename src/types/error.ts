export class ErrorSDKInitialization extends Error {}
export class ErrorSDKAuthInitialization extends Error {}
export class ErrorSDKAuthService extends Error {}
export class ErrorInvalidMnemnoic extends Error {}
export class ErrorInvalidSeed extends Error {}
export class ErrorInvalidPrivateKey extends Error {}
export class ErrorInvalidRange extends Error {}
export class ErrorInvalidAddress extends Error {}
export class ErrorGettingCollections extends Error {}
export class ErrorGettingNFTInfo extends Error {}
export class ErrorGettingAllOwnedNFTsInfo extends Error {}

export class ErrorGeneric extends Error {
  constructor(err: Record<string, any>) {
    super(JSON.stringify(err));
  }
}

export class ErrorAPIQuery extends Error {
  constructor(err?: string) {
    super(JSON.stringify({ reason: 'API_FAILURE', explanation: err }));
  }
}

export class ErrorInvalidArg extends Error {
  constructor(err?: string) {
    super(JSON.stringify({ reason: 'INVALID_PAYLOAD', explanation: err }));
  }
}

export const errorType = {
  ErrorSDKInitialization: 'SDK not initialized properly',
  ErrorSDKAuthInitialization: 'initAuth method should be called before connect method',
  ErrorSDKAuthService: 'Please Provide valid Authentication Service',
  ErrorGeneric: 'Something went wrong. Please try again',
  ErrorChainId: 'Swap on this network is not supported',
};
