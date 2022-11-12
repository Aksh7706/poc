import { App, Prisma, Provider, User, Event } from '@prisma/client';

export type createAppArgs = Pick<Prisma.AppUncheckedCreateInput, 'name' | 'description' | 'metadata' | 'ownerAddress'>;
export type updateAppArgs = Pick<Prisma.AppCreateInput, 'name' | 'description' | 'metadata'>;

export type AppData = App & {
  User: User[];
  Event: Event[];
  Provider: Provider[];
};
