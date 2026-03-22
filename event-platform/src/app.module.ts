import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { databaseConfig } from './config/database.config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EventsModule } from './events/events.module';
import { TicketsModule } from './tickets/tickets.module';
import { PaymentsModule } from './payments/payments.module';
import { QrCodeModule } from './qrcode/qrcode.module';
import { CategoriesModule } from './categories/categories.module';
import { VenuesModule } from './venues/venues.module';
import { ReviewsModule } from './reviews/reviews.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(databaseConfig()),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
      },
    }),
    AuthModule,
    UsersModule,
    EventsModule,
    TicketsModule,
    PaymentsModule,
    QrCodeModule,
    CategoriesModule,
    VenuesModule,
    ReviewsModule,
    NotificationsModule,
  ],
})
export class AppModule {}
