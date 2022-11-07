import Joi from 'joi';
import { db } from './db/db';
import { ErrorAPIQuery, ErrorGeneric, ErrorInvalidArg, errorType } from './types';
import { Response } from 'express';
import { AxiosError } from 'axios';

export const appExists = async (appName: string) => {
  const app = await db.app.get(appName);
  if (!app) throw new ErrorInvalidArg('App does not exist');
  return app;
};

export const providerExists = async (appName: string, providerName: string) => {
  const provider = await db.provider.get(appName, providerName);
  if (!provider) throw new ErrorInvalidArg('Provider does not exist');
  return provider;
};

export const eventExists = async (appName: string, eventName: string) => {
  const event = await db.event.get(appName, eventName);
  if (!event) throw new ErrorInvalidArg('Event does not exist');
  return event;
};

export const userExists = async (appName: string, walletAddress: string) => {
  const user = await db.user.get(appName, walletAddress);
  if (!user) throw new ErrorInvalidArg('No such user exist in this app');
  return user;
};

export const checkUniqueProvider = async (appName: string, providerName: string) => {
  const provider = await db.provider.get(appName, providerName);
  if (provider !== null) {
    throw new ErrorInvalidArg('Provider name not unique');
  }
};

export const checkUniqueEvent = async (appName: string, eventName: string) => {
  const event = await db.event.get(appName, eventName);
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
