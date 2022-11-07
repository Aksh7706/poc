import { Channel, PrismaClient, ProviderKey } from '@prisma/client';
import { db } from '../src/db/db';

describe('Db', () => {
  const APP_NAME = 'REV_FIN_TEST';
  const TEST_PROVIDER_TELEGRAM = 'TEST_PROVIDER_TELEGRAM';
  const TEST_PROVIDER_INAPP = 'TEST_PROVIDER_INAPP';
  const TEST_PROVIDER_FIREBASE = 'TEST_PROVIDER_FIREBASE';
  const TEST_EVENT = 'TEST_EVENT';
  const USER_ADDRESS = 'akshay.test.near';

  it('App', async () => {
    // create a test app
    const app = await db.app.create({
      name: APP_NAME,
      description: 'App for Rev Finance Dapp. The dapp can use this app to send different types of notifications.',
    });

    expect(app).toBeDefined();
  });

  it('User', async () => {
    // create a new user
    const user = await db.user.create(APP_NAME, {
      walletAddress: USER_ADDRESS,
      email: 'test@email.com',
    });

    const chatIdData = [
      { providerName: 'provider1', chatId: 'chat1' },
      { providerName: 'provider2', chatId: 'chat2' },
      { providerName: 'provider3', chatId: 'chat3' },
      { providerName: 'provider1', chatId: 'chat1' },
    ];

    const updatedUser = await db.user.addTelegramChatId(user.appName, user.walletAddress, chatIdData);
    expect(updatedUser).toBeDefined();
  });

  it('Update', async () => {
    await db.user.update(APP_NAME, USER_ADDRESS, {
      mobile: '9999999999',
    });

    await db.user.updateTelegramChatId(APP_NAME, USER_ADDRESS, 'provider3', 'chat3Updated');
    await db.user.updateTelegramChatId(APP_NAME, USER_ADDRESS, 'provider4', 'chat4');
    await db.user.deleteTelegramChatId(APP_NAME, USER_ADDRESS, 'provider1');
    const updatedUser = await db.user.deleteTelegramChatId(APP_NAME, USER_ADDRESS, 'provider6');

    expect(updatedUser?.telegramData.length).toBe(3);
  });

  it('Provider', async () => {
    const telegramProvider = await db.provider.create(APP_NAME, {
      name: TEST_PROVIDER_TELEGRAM,
      channel: Channel.OTHER,
      config: { chat_id: 'chat_id' },
      providerKey: ProviderKey.TELEGRAM,
    });

    expect(telegramProvider).toBeDefined();

    const inAppProvider = await db.provider.create(APP_NAME, {
      name: TEST_PROVIDER_INAPP,
      channel: Channel.OTHER,
      providerKey: ProviderKey.TELEGRAM,
    });

    expect(inAppProvider).toBeDefined();

    const firebaseProvider = await db.provider.create(APP_NAME, {
      name: TEST_PROVIDER_FIREBASE,
      channel: Channel.PUSH,
      providerKey: ProviderKey.FIREBASE,
    });

    expect(firebaseProvider).toBeDefined();

    // Provider For Other Channel
    const allProviderOther = await db.provider.getAll(APP_NAME, 'OTHER');
    expect(allProviderOther.length).toBe(2);

    // Provider For Push Channel
    const allProviderPush = await db.provider.getAll(APP_NAME, 'PUSH');
    expect(allProviderPush.length).toBe(1);
  });

  it('Event', async () => {
    const firebaseEvent = await db.event.create(APP_NAME, {
      name: TEST_EVENT,
      template: 'Hey! Sample Push Notification',
      connectedProviders: {
        createMany: {
          data: [{
            providerName: TEST_PROVIDER_FIREBASE,
          }, {
            providerName: TEST_PROVIDER_TELEGRAM
          }]
        }
      }
    });

    expect(firebaseEvent).toBeDefined();
  });

  it('Clear Test Data', async () => {
    await db.app.delete(APP_NAME);
  });
});
