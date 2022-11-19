"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.template = void 0;
exports.template = `
import assert from "assert";
import { types } from "near-lake-framework";
import { SupportedProtocolsTypes, TxDetails } from "./protocol-types";

export enum {{appName}}SupportedEvents {
    Generic = "Generic",
}

export interface {{appName}}DataParams {
    methodName: string;
    contractAddress: string;
    timestamp: string;
}

// add support for your tx details type to TxDetails union type in protocol-types.ts
export declare type {{appName}}TxDetails = {
    appName: "{{receiverId}}";
    userWalletAddress: string;
    txHash: string;
    eventName: {{appName}}SupportedEvents.Generic
    data: {{appName}}DataParams
}

/**
 * @param receiverId contract where the transaction was sent
 * @param actions actions of the transaction
 * @param signerId signer of the transaction
 * @param txHash tx
 * @param timestamp timestamp of the transaction
 * 
 * @returns array of tx details
 */
export const {{appName}}TxParser = async (receiverId: string, actions: types.FunctionCallAction[], signerId: string, txHash: string, timestamp: Date): Promise<TxDetails[]> => {
    const allTxDetails: TxDetails[] = [];
    assert(receiverId === "{{receiverId}}", "ReceiverId is not {{receiverId}}");
    for(let i = 0; i < actions.length; i++) {
        const action = actions[i];
        const { args: _encodedArgs, methodName } = action.FunctionCall;
        try {
                if (methodName === "some_method_specific_to_your_app") {
                    const txDetails: TxDetails = {
                        // add your appName to SupportedProtocolsTypes file at protocol-types.ts
                        appName: SupportedProtocolsTypes.{{appName}},
                        contractAddress: {{receiverId}},
                        data: {
                            methodName: methodName,
                            contractAddress: receiverId,
                            timestamp: timestamp.toDateString(),
                        },
                        eventName: {{appName}}SupportedEvents.Generic,
                        userWalletAddress: signerId,
                        txHash,
                    }

                    allTxDetails.push(txDetails);
                }
        } catch (error) {
            // console.log(error);
        }
    }

    return allTxDetails;
}
`;
