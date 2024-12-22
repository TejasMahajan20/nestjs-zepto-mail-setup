import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MailModule } from './modules/mail/mail.module';

import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [MailModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
