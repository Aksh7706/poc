import { Prisma } from '@prisma/client';

export type createUserArgs = Omit<Prisma.UserUncheckedCreateInput, 'appId' | 'createdAt' | 'updatedAt' | 'id'>;
export type updateUserArgs = Omit<createUserArgs, 'walletAddress'>;
