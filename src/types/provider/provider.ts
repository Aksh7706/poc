import { App, Channel, ProviderKey, User, TelegramProvider, Event, Provider } from '@prisma/client';


export type SetupProviderArgs = {
  appId: string;
  providerName: string;
  provider: ProviderKey;
  channel: Channel;
  config: Record<string, string>;
};

export type SendEventArgs = {
  app: App,
  user: User & {telegramData: TelegramProvider[]}
  provider: Provider;
  event: Event;
  data: SendEventArgsData;
};

export type SendEventArgsData = {
  message: string;
  subject: string;
}
