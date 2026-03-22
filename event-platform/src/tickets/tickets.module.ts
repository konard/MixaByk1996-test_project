import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { Ticket } from './ticket.entity';
import { Event } from '../events/event.entity';
import { PaymentsModule } from '../payments/payments.module';
import { QrCodeModule } from '../qrcode/qrcode.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket, Event]),
    PaymentsModule,
    QrCodeModule,
  ],
  controllers: [TicketsController],
  providers: [TicketsService],
  exports: [TicketsService],
})
export class TicketsModule {}
