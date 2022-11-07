import { Prisma } from '@prisma/client';

export type createProviderArgs = Omit<Prisma.ProviderCreateInput, 'app' | 'event' | 'id' | 'createdAt' | 'updatedAt'>;
export type updateProviderArgs = Omit<
  Prisma.ProviderCreateInput,
  'name' | 'app' | 'event' | 'id' | 'createdAt' | 'updatedAt'
>;
