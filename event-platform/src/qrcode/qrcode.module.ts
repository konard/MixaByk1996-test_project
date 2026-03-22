import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QrCodeService } from './qrcode.service';
import { QrCodeProcessor } from './qrcode.processor';
import { Ticket } from '../tickets/ticket.entity';
import { Notification } from '../notifications/notification.entity';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'qrcode',
    }),
    TypeOrmModule.forFeature([Ticket, Notification]),
  ],
  providers: [QrCodeService, QrCodeProcessor],
  exports: [QrCodeService],
})
export class QrCodeModule {}
