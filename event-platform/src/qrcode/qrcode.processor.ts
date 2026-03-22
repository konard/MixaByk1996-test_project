import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as QRCode from 'qrcode';
import { Ticket, TicketStatus } from '../tickets/ticket.entity';
import { Notification, NotificationType } from '../notifications/notification.entity';

@Processor('qrcode')
export class QrCodeProcessor {
  constructor(
    @InjectRepository(Ticket)
    private ticketsRepository: Repository<Ticket>,
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
  ) {}

  @Process('generate')
  async handleGenerate(job: Job<{ ticketId: string; userId: string }>) {
    const { ticketId, userId } = job.data;

    const ticket = await this.ticketsRepository.findOne({
      where: { id: ticketId },
    });

    if (!ticket) {
      return;
    }

    const qrData = JSON.stringify({
      ticketId: ticket.id,
      eventId: ticket.eventId,
      userId: ticket.userId,
      timestamp: Date.now(),
    });

    const qrCode = await QRCode.toDataURL(qrData);

    ticket.qrCode = qrCode;
    ticket.status = TicketStatus.CONFIRMED;
    await this.ticketsRepository.save(ticket);

    const notification = this.notificationsRepository.create({
      userId,
      message: `Your ticket ${ticketId} has been confirmed. QR code is ready.`,
      type: NotificationType.TICKET_PURCHASED,
    });

    await this.notificationsRepository.save(notification);
  }
}
