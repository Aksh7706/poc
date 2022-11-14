import { SendEventArgs } from '../../types';
import sgMail from '@sendgrid/mail';

export class SendGridMail {
  async sendMessage({ provider, user, data }: SendEventArgs) {
    let fromAddress, fromName, apiKey, replyToAddress;

    if (provider.config) {
      const config = provider.config as Record<string, string>;
      fromAddress = config.fromAddress;
      fromName = config.fromName;
      apiKey = config.apiKey;
      replyToAddress = config.replyToAddress;
    }

    if (!fromAddress || !fromName || !apiKey || !replyToAddress || !user.email) return;

    sgMail.setApiKey(apiKey);

    // Sample message
    // const msg = {
    //   to: 'test@example.com',
    //   from: 'test@example.com', // Use the email address or domain you verified above
    //   subject: 'Sending with Twilio SendGrid is Fun',
    //   text: 'and easy to do anywhere, even with Node.js',
    //   html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    // };
    
    await sgMail.send({
      to: user.email,
      replyTo: replyToAddress,
      from: {
        email: fromAddress,
        name: fromName
      },
      subject: data.subject,
      html: data.message,
    });
  }
}
