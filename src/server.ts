import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Express } from 'express';
import appRoutes from './routes/app';
import providerRoutes from './routes/provider';
import eventRoutes from './routes/event';
import webhookRoutes from './routes/webhook';
import sendRoutes, { sendEventArgs, sendEventHelper } from './routes/send';
import { RabbitMqConnection } from './rabbitmq';
import { Message } from 'amqplib';
import { SendEventArgs } from './types';

const app = express();
const port = 3000;

function setUpParsing(app: Express): void {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(express.text({ type: 'text/html' }));
}

function setUpSecurityHeaders(app: Express): void {
  app.use((_, res, next) => {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Content-Security-Policy', "default-src 'none'");
    next();
  });
}

app.use(cors());
setUpSecurityHeaders(app);
setUpParsing(app);

app.use('/apps', appRoutes, providerRoutes, eventRoutes, sendRoutes);
app.use(webhookRoutes);

app.listen(port, async () => {
  console.log(`Timezones by location application is running on port ${port}.`);
  console.log(process.env.DATABASE_URL);

  const rabbitMqConnection = new RabbitMqConnection();
  await rabbitMqConnection.setUp();
  await rabbitMqConnection.channel.consume('nnp-msg-queue', async (msg) => {
    console.log('listening', msg?.content.toString());
    if(msg?.content){
      const sendParams = JSON.parse(msg?.content.toString()) as sendEventArgs;
      await sendEventHelper(sendParams);
    }
    rabbitMqConnection.channel.ack(msg as Message)
  });
});
