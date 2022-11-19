import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Express } from 'express';
import accountRoutes from './routes/account';
import appRoutes from './routes/app';
import providerRoutes from './routes/provider';
import eventRoutes from './routes/event';
import webhookRoutes from './routes/webhook';
import authRoutes from './routes/auth';
import notificationRoutes from './routes/notifications';
import userRoutes from './routes/user';
import sendRoutes, { sendEventArgs, sendEventFromParser } from './routes/send';
import { RabbitMqConnection } from './rabbitmq';
import { Message } from 'amqplib';
import cookieParser from 'cookie-parser';
import path from 'path';

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
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,UPDATE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    next();
  });
}

var corsOptions = {
  credentials: true,
  origin: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());

// app.get('/images/:imageName', (req, res) => {
//   res.sendFile(path.join(__dirname,'../../src', 'static', 'provider', req.params.imageName))
// });

app.use('/images', express.static(path.join(__dirname, '../../src', 'static', 'provider')));

setUpSecurityHeaders(app);
setUpParsing(app);

app.use('/account', accountRoutes);
app.use('/auth', authRoutes);
app.use('/providers', providerRoutes);
app.use('/events', eventRoutes);
app.use('/apps', appRoutes, sendRoutes);
app.use('/send', sendRoutes);
app.use('/notifications', notificationRoutes);
app.use('/users', userRoutes);
app.use(webhookRoutes);

app.listen(port, async () => {
  console.log(`Near notification platform is running on port ${port}.`);
  const rabbitMqConnection = new RabbitMqConnection();
  await rabbitMqConnection.setUp();
  //let i =0;
  await rabbitMqConnection.channel.consume('nnp-msg-queue', (msg) => {
    if (msg?.content) {
      //console.log("Count", i++)
      const sendParams = JSON.parse(msg?.content.toString());
      sendEventFromParser(sendParams).then(e => {
        rabbitMqConnection.channel.ack(msg as Message);
        //console.log("Count Ack")
      }).catch(e => {});
    }
  })
});
