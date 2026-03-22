import { IsUUID, IsString } from 'class-validator';

export class PurchaseTicketDto {
  @IsUUID()
  eventId: string;

  @IsString()
  paymentMethodId: string;
}
