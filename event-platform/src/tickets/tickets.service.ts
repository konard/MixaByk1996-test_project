import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './ticket.entity';
import { Event } from '../events/event.entity';
import { PaymentsService } from '../payments/payments.service';
import { QrCodeService } from '../qrcode/qrcode.service';
import { PurchaseTicketDto } from './dto/purchase-ticket.dto';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private ticketsRepository: Repository<Ticket>,
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
    private paymentsService: PaymentsService,
    private qrCodeService: QrCodeService,
  ) {}

  async findAll(userId?: string): Promise<Ticket[]> {
    const where = userId ? { userId } : {};
    return this.ticketsRepository.find({
      where,
      relations: ['event', 'payment'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Ticket> {
    const ticket = await this.ticketsRepository.findOne({
      where: { id },
      relations: ['event', 'user', 'payment'],
    });
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }
    return ticket;
  }

  async purchase(
    purchaseTicketDto: PurchaseTicketDto,
    userId: string,
  ): Promise<Ticket> {
    const event = await this.eventsRepository.findOne({
      where: { id: purchaseTicketDto.eventId },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const ticketCount = await this.ticketsRepository.count({
      where: { eventId: event.id },
    });

    if (ticketCount >= event.capacity) {
      throw new BadRequestException('Event is sold out');
    }

    const payment = await this.paymentsService.createPayment(
      {
        eventId: event.id,
        amount: Number(event.price),
        paymentMethodId: purchaseTicketDto.paymentMethodId,
      },
      userId,
    );

    const ticket = this.ticketsRepository.create({
      userId,
      eventId: event.id,
      paymentId: payment.id,
    });

    const savedTicket = await this.ticketsRepository.save(ticket);

    await this.qrCodeService.generateQrCode(savedTicket.id, userId);

    return savedTicket;
  }
}
