import { App, Prisma, Provider, User, Event } from '@prisma/client';

export type createAppArgs = Pick<Prisma.AppCreateInput, 'name' | 'description' | 'metadata'>;
export type updateAppArgs = Pick<Prisma.AppCreateInput, 'description' | 'metadata'>;

export type AppData = App & {
  User: User[];
  Event: Event[];
  Provider: Provider[];
};
