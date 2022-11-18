import { Prisma } from '@prisma/client';

export type createEventArgs = Pick<Prisma.EventUncheckedCreateInput, 'name' | 'template' | 'metadata' | 'connectedProviders'>;
export type updateEventArgs = Omit<createEventArgs, 'name' | 'connectedProviders'>;
