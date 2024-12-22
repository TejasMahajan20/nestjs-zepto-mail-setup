import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { ZeptoMailClient } from './zepto-mail-client';

@Module({
  providers: [MailService, ZeptoMailClient],
  exports: [MailService]
})
export class MailModule {}
