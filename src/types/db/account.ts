import { Prisma } from "@prisma/client";

export type createAccountArgs = Pick<Prisma.AccountCreateInput, 'name'  | 'ownerAddress' | 'contractAddress'>;
export type updateAccountArgs = Pick<createAccountArgs, 'name' | 'contractAddress'>;