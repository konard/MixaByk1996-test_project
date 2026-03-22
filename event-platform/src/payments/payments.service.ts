import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Stripe from 'stripe';
import { Payment, PaymentStatus } from './payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2023-10-16',
    });
  }

  async findAll(userId?: string): Promise<Payment[]> {
    const where = userId ? { userId } : {};
    return this.paymentsRepository.find({
      where,
      relations: ['user', 'event'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Payment> {
    const payment = await this.paymentsRepository.findOne({
      where: { id },
      relations: ['user', 'event', 'tickets'],
    });
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }
    return payment;
  }

  async createPayment(
    createPaymentDto: CreatePaymentDto,
    userId: string,
  ): Promise<Payment> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(createPaymentDto.amount * 100),
        currency: createPaymentDto.currency || 'usd',
        payment_method: createPaymentDto.paymentMethodId,
        confirm: true,
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: 'never',
        },
      });

      const payment = this.paymentsRepository.create({
        userId,
        eventId: createPaymentDto.eventId,
        stripePaymentId: paymentIntent.id,
        amount: createPaymentDto.amount,
        currency: createPaymentDto.currency || 'usd',
        status:
          paymentIntent.status === 'succeeded'
            ? PaymentStatus.COMPLETED
            : PaymentStatus.PENDING,
      });

      return this.paymentsRepository.save(payment);
    } catch (error) {
      throw new BadRequestException(
        `Payment failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async updateStatus(id: string, status: PaymentStatus): Promise<Payment> {
    const payment = await this.findOne(id);
    payment.status = status;
    return this.paymentsRepository.save(payment);
  }
}
