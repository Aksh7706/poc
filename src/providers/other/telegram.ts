import { Provider } from '@prisma/client';
import axios from 'axios';
import { ErrorInvalidArg, SendEventArgs, TelegramResponse } from '../../types';

export class Telegram {
  baseURL = 'https://api.telegram.org';
  serverURL = process.env.SERVER_URL;

  //Send Api Telegram
  //https://api.telegram.org/bot{bot_token}/sendMessage?chat_id={chat_id}&text={text}

  async sendMessage({ user, provider, data }: SendEventArgs) {
    let chatId, token;
    const chatIdData = user.telegramData.filter((data) => data.providerName === provider.name)[0];
    chatId = chatIdData?.chatId;

    if (provider.config) {
      const config = provider.config as Record<string, string>;
      token = config.telegramBotToken;
    }

    if (!token) {
      console.log('Send Event Log : Bot token not found');
      return;
    }
    if (!chatId) {
      console.log('Send Event Log : User chat id not found');
      return;
    }

    const params = {
      chat_id: chatId,
      text: data.message
    };

    const methodEndpoint = `${this.baseURL}/bot${token}/sendMessage`;

    await axios.get(methodEndpoint, { params }).catch(e => {
      console.log("Telegram Send Error : ", e)
      throw e
    });
    //console.log(data);
  }

  async sendWelcomeMessage(provider: Provider, chatId: string, appName: string) {
    let token;
    if (provider.config) {
      const config = provider.config as Record<string, string>;
      token = config.telegramBotToken;
    }

    if (!token) {
      console.log('Send Event Log : Bot token not found');
      return;
    }
    const message = `Thanks for subscribing at ${appName}.\n We will be sending your on-chain and product notifications here.`
    const methodEndpoint = `${this.baseURL}/bot${token}/sendMessage`;
    const params = {
      chat_id: chatId,
      text: message
    };
    await axios.get(methodEndpoint, { params }).catch(e => {
      // do nothing
    });
  }

  async setupProvider(appId: string, providerName: string, token?: string) {
    if (!token) throw new ErrorInvalidArg('Bot Access Token Invalid');
    await this.addWebhook(appId, providerName, token);
  }

  async removeProvider(token?: string) {
    if (!token) throw new ErrorInvalidArg('Bot Access Token Invalid');
    await this.deleteWebhook(token);
  }

  async addWebhook(appId: string, providerName: string, token: string) {
    const params = { url: `${this.serverURL}/webhook/${appId}/${providerName}` };
    const methodEndpoint = `${this.baseURL}/bot${token}/setWebhook`;
    const { data } = await axios.get<TelegramResponse>(methodEndpoint, { params });
    if (!data.ok) throw new ErrorInvalidArg(data.description);
  }

  async deleteWebhook(token: string) {
    const methodEndpoint = `${this.baseURL}/bot${token}/deleteWebhook`;
    const { data } = await axios.get<TelegramResponse>(methodEndpoint);
    if (!data.ok) throw new ErrorInvalidArg(data.description);
  }
}
