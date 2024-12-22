import { Injectable, Logger } from '@nestjs/common';
import { ZeptoMailClient } from './zepto-mail-client';

@Injectable()
export class MailService {
    private readonly logger: Logger = new Logger(MailService.name);

    constructor(private readonly zeptoMailClient: ZeptoMailClient) { }

    async sendOTP(email: string, OTP: string, name?: string) {
        const templateKey = process.env.ZEPTO_MAIL_OTP_TEMPLATE_KEY;
        const appName = process.env.APP_NAME;

        const merge_info = {
            name,
            OTP,
            team: appName,
            product_name: appName
        };

        const subject = process.env.ZEPTO_MAIL_OTP_EMAIL_SUBJECT;

        try {
            await this.zeptoMailClient.sendMail(templateKey, email, merge_info, subject);
            this.logger.log(`OTP mail sent to: ${email}`);
        } catch (error) {
            this.logger.error(`Failed to send OTP mail to: ${email}`, error.stack);
        }
    }

    async sendVerificationLink(email: string, passwordSetLink: string, name?: string) {
        const templateKey = process.env.ZEPTO_MAIL_VERIFICATION_LINK_TEMPLATE_KEY;
        const appName = process.env.APP_NAME;

        const merge_info = {
            name,
            password_set_link: passwordSetLink,
            team: appName,
            product_name: appName,
            email
        };

        const subject = process.env.ZEPTO_MAIL_VERIFICATION_EMAIL_SUBJECT;

        try {
            await this.zeptoMailClient.sendMail(templateKey, email, merge_info, subject);
            this.logger.log(`Verification link sent to: ${email}`);
        } catch (error) {
            this.logger.error(`Failed to send verification link to: ${email}`, error.stack);
        }
    }


}
