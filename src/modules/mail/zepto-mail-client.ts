import { Injectable, Logger } from '@nestjs/common';
import { SendMailClient } from 'zeptomail';

@Injectable()
export class ZeptoMailClient {
    private readonly client: SendMailClient;
    private readonly logger: Logger = new Logger(ZeptoMailClient.name);

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
            this.logger.log(`Email successfully dispatched to ${email}`);
        } catch (error) {
            this.logger.error('Error while sending email', error);
            throw error;
        }
    }
}
