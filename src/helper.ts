import Joi from 'joi';
import { db } from './db/db';
import { ErrorAPIQuery, ErrorGeneric, ErrorInvalidArg, errorType, SendEventArgs } from './types';
import { Response } from 'express';
import { AxiosError } from 'axios';
import { sendEventArgs } from './routes/send';
import { Message } from 'amqplib';
import { MessageStatus } from '@prisma/client';

export const appExists = async (appName: string, ownerAddress: string) => {
  const app = await db.app.get(appName, ownerAddress);
  if (!app) throw new ErrorInvalidArg('App does not exist');
  return app;
};

export const providerExists = async (appId: string, providerName: string) => {
  const provider = await db.provider.get(appId, providerName);
  if (!provider) throw new ErrorInvalidArg('Provider does not exist');
  return provider;
};

export const eventExists = async (appId: string, eventName: string) => {
  const event = await db.event.get(appId, eventName);
  if (!event) throw new ErrorInvalidArg('Event does not exist');
  return event;
};

export const userExists = async (appName: string, walletAddress: string) => {
  const user = await db.user.get(appName, walletAddress);
  if (!user) throw new ErrorInvalidArg('No such user exist in this app');
  return user;
};

export const checkUniqueProvider = async (appId: string, providerName: string) => {
  const provider = await db.provider.get(appId, providerName);
  if (provider !== null) {
    throw new ErrorInvalidArg('Provider name not unique');
  }
};

export const checkUniqueEvent = async (appId: string, eventName: string) => {
  const event = await db.event.get(appId, eventName);
  if (event !== null) {
    throw new ErrorInvalidArg('Event name not unique');
  }
};

export function validatePayload(data: any, schema: Joi.ObjectSchema<any>) {
  const { value, error, warning } = schema.validate(data);
  if (error === undefined && warning === undefined) return value;
  throw new ErrorGeneric({ reason: 'INVALID_PAYLOAD', explanation: error ?? warning });
}

export const handleError = (err: any, res: Response) => {
  if (err instanceof AxiosError) {
    const data = err.response?.data;
    const formattedErr = new ErrorAPIQuery(data?.description);
    res.status(400).send(formattedErr.message);
  } else if (err instanceof Error) {
    res.status(400).send(err.message);
  } else {
    console.log('Error : ', err);
    res.status(400).send(errorType.ErrorGeneric);
  }
};


export const logEvent = async ({app,event, message,provider,user } : SendEventArgs, status: MessageStatus )=> {
  await db.log.create({
    appName: app.name,
    eventName: event.name,
    providerName: provider.name,
    ownerAddress: app.ownerAddress,
    channel: provider.channel,
    providerType: provider.providerKey,
    userWalletAdress: user.walletAddress,
    message: message,
    status: status,
  })
} 