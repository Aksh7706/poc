import { PrismaClient } from '@prisma/client';
import { SendEventArgs, SetupProviderArgs } from '../types';
import { Pigeon } from './inapp/pegion';
import { Telegram } from './other/telegram';

export class Provider {
  prisma = new PrismaClient();

  async setupProvider(args: SetupProviderArgs) {
    // add cases here
    switch (args.channel) {
      case 'PUSH':
        return this.setupPushProvider(args);
      case 'IN_APP':
        return this.setupInAppProvider(args);
      case 'OTHER':
        return this.setupOtherProvider(args);
    }
  }

  async removeProvider(args: SetupProviderArgs) {
    // add cases here
    switch (args.channel) {
      case 'PUSH':
        return this.removePushProvider(args);
      case 'IN_APP':
        return this.removeInAppProvider(args);
      case 'OTHER':
        return this.removeOtherProvider(args);
    }
  }

  async send(args: SendEventArgs) {
    // add cases here
    switch (args.provider.channel) {
      case 'MAIL':
        return this.sendMailEvent(args);
      case 'IN_APP':
        return this.sendInAppEvent(args);
      case 'OTHER':
        return this.sendOtherEvent(args);
    }
  }

  private async setupOtherProvider({ appId, config, provider, providerName }: SetupProviderArgs) {
    if (provider === 'TELEGRAM') {
      const telegramProvider = new Telegram();
      await telegramProvider.setupProvider(appId, providerName, config.telegramBotToken);
    }
  }

  private async removeOtherProvider({ appId, config, provider, providerName }: SetupProviderArgs) {
    if (provider === 'TELEGRAM') {
      const telegramProvider = new Telegram();
      await telegramProvider.removeProvider(config.telegramBotToken);
      await this.prisma.telegramProvider.deleteMany({
        where: {
          appId: appId,
          providerName: providerName,
        },
      });
    }
  }

  private async sendOtherEvent(args: SendEventArgs) {
    if (args.provider.providerKey === 'TELEGRAM') {
      const telegramProvider = new Telegram();
      await telegramProvider.sendMessage(args);
    }
  }

  private setupPushProvider(_args: SetupProviderArgs) {
    // do noting
  }

  private removePushProvider(_args: SetupProviderArgs) {
    // do noting
  }

  private setupInAppProvider(_args: SetupProviderArgs) {
    // do nothing
  }

  private removeInAppProvider(_args: SetupProviderArgs) {
    // do nothing
  }

  private sendMailEvent(args: SendEventArgs) {
    if(args.provider.providerKey === 'SENDGRID_MAIL'){
      
    }
  }

  private async sendInAppEvent(args: SendEventArgs) {
    if (args.provider.providerKey === 'PIGEON') {
      const pigeonProvider = new Pigeon();
      await pigeonProvider.sendMessage(args);
    }
  }
}
