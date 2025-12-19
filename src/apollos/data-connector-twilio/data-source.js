import { DataSource } from 'apollo-datasource';
import ApollosConfig from '../config/index.js';
import Twilio from 'twilio';
import util from 'util';
const logError = (...args) => process.stderr.write(`${util.format(...args)}\n`);




const { TWILIO } = ApollosConfig;

export default class TwilioSms extends DataSource {
  constructor(...args) {
    super(...args);
    if (TWILIO.ACCOUNT_SID && TWILIO.AUTH_TOKEN) {
      this.twilio = new Twilio(TWILIO.ACCOUNT_SID, TWILIO.AUTH_TOKEN);
    } else {
      logError(
        'You are using the twilio datasource without twilio credentials. To avoid issues, add Twilio credentials to your config.yml or remove the Twilio datasource'
      );
    }
  }

  //
  sendSms({ body, to, from = TWILIO.FROM_NUMBER, ...args }) {
    return this.twilio.messages.create({
      body,
      to,
      from,
      ...args,
    });
  }
}
