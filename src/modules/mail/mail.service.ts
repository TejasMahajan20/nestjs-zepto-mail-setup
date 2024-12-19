import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { SendMailClient } from 'zeptomail';

@Injectable()
export class MailService {
    private readonly client: SendMailClient;
    private readonly logger: Logger = new Logger(MailService.name);

    constructor() {
        this.client = new SendMailClient({
            url: process.env.ZEPTO_MAIL_REST_API_ENDPOINT,
            token: process.env.ZEPTO_MAIL_REST_API_KEY,
        });
    }

    async sendMail(templateKey: string, email: string, merge_info: object, subject: string) {
        const mailInfo = {
            "mail_template_key": templateKey,
            "from":
            {
                "address": process.env.ZEPTO_MAIL_SENDER_EMAIL_ID,
            },
            "to":
                [
                    {
                        "email_address":
                        {
                            "address": email
                        }
                    }
                ],
            "merge_info": merge_info,
            "subject": subject
        }

        try {
            await this.client.sendMail(mailInfo);
            this.logger.log(`Mail sent to: ${email}`);
        } catch (error) {
            this.logger.error(`Mail failed for: ${email}`, error.stack);
        }
    }

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
            await this.sendMail(templateKey, email, merge_info, subject);
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
            await this.sendMail(templateKey, email, merge_info, subject);
            this.logger.log(`Verification link sent to: ${email}`);
        } catch (error) {
            this.logger.error(`Failed to send verification link to: ${email}`, error.stack);
        }
    }


}