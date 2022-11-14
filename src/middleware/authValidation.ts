import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { accountExists } from '../helper';

export const authValidation = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.sendStatus(403);
  }
  try {
    const data: any = jwt.verify(token, 'YOUR_SECRET_KEY');
    if (!data?.ownerAddress) return res.clearCookie('access_token').sendStatus(403);
    req.ownerAddress = data.ownerAddress;
    return next();
  } catch {
    return res.clearCookie('access_token').sendStatus(403);
  }
};

export const omniAuthValidation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.access_token;
    if (token) return authValidation(req, res, next);
    if (!req.body.apiKey) return res.sendStatus(403);
    const account = await accountExists(req.body.apiKey);
    req.ownerAddress = account.ownerAddress;
    return next();
  } catch {
    return res.sendStatus(403);
  }
};
