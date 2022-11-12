import { Prisma } from "@prisma/client";

export type createAccountArgs = Pick<Prisma.AccountCreateInput, 'name'  | 'ownerAddress'>;
export type updateAccountArgs = Pick<createAccountArgs, 'name'>;