import {Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authValidation = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.sendStatus(403);
  }
  try {
    const data: any = jwt.verify(token, 'YOUR_SECRET_KEY');
    if(!data?.ownerAddress) return res.clearCookie("access_token").sendStatus(403);
    req.ownerAddress = data.ownerAddress
    return next();
  } catch {
    return res.clearCookie("access_token").sendStatus(403);
  }
};
