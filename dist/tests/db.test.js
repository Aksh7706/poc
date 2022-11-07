"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const db_1 = require("../src/db/db");
describe('Db', () => {
    const APP_NAME = 'REV_FIN_TEST';
    const TEST_PROVIDER_TELEGRAM = 'TEST_PROVIDER_TELEGRAM';
    const TEST_PROVIDER_INAPP = 'TEST_PROVIDER_INAPP';
    const TEST_PROVIDER_FIREBASE = 'TEST_PROVIDER_FIREBASE';
    const TEST_EVENT = 'TEST_EVENT';
    it('App', async () => {
        // create a test app
        const app = await db_1.db.app.create({
            name: APP_NAME,
            description: 'App for Rev Finance Dapp. The dapp can use this app to send different types of notifications.',
        });
        expect(app).toBeDefined();
    });
    it('User', async () => {
        const userAddress = 'akshay.test.near';
        // create a new user
        const user = await db_1.db.user.create(APP_NAME, {
            walletAddress: userAddress,
        });
        expect(user).toBeDefined();
        const mobile = '999999999'; // update mobile number
        const updatedUser = await db_1.db.user.update(APP_NAME, userAddress, {
            mobile: mobile,
        });
        expect(updatedUser.mobile).toBe(mobile);
    });
    it('Provider', async () => {
        const telegramProvider = await db_1.db.provider.create(APP_NAME, {
            name: TEST_PROVIDER_TELEGRAM,
            channel: client_1.Channel.OTHER,
            config: { chat_id: 'chat_id' },
            providerKey: client_1.ProviderKey.TELEGRAM,
        });
        expect(telegramProvider).toBeDefined();
        const inAppProvider = await db_1.db.provider.create(APP_NAME, {
            name: TEST_PROVIDER_INAPP,
            channel: client_1.Channel.OTHER,
            providerKey: client_1.ProviderKey.TELEGRAM,
        });
        expect(inAppProvider).toBeDefined();
        const firebaseProvider = await db_1.db.provider.create(APP_NAME, {
            name: TEST_PROVIDER_FIREBASE,
            channel: client_1.Channel.PUSH,
            providerKey: client_1.ProviderKey.FIREBASE,
        });
        expect(firebaseProvider).toBeDefined();
        // Provider For Other Channel
        const allProviderOther = await db_1.db.provider.getAll(APP_NAME, 'OTHER');
        expect(allProviderOther.length).toBe(2);
        // Provider For Push Channel
        const allProviderPush = await db_1.db.provider.getAll(APP_NAME, 'PUSH');
        expect(allProviderPush.length).toBe(1);
    });
    it('Event', async () => {
        const allProviderPush = await db_1.db.provider.getAll(APP_NAME, 'PUSH', 'FIREBASE');
        const firebaseEvent = await db_1.db.event.create(APP_NAME, {
            name: TEST_EVENT,
            template: 'Hey! Sample Push Notification',
            providerId: allProviderPush[0]?.id,
        });
        expect(firebaseEvent).toBeDefined();
        const allEventsFirebase = await db_1.db.event.getAll(APP_NAME, undefined, 'FIREBASE');
        expect(allEventsFirebase.length).toBe(1);
    });
    it('Clear Test Data', async () => {
        await db_1.db.app.delete(APP_NAME);
    });
});
