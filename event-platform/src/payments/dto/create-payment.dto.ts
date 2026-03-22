import { IsUUID, IsNumber, IsPositive, IsOptional, IsString } from 'class-validator';

export class CreatePaymentDto {
  @IsUUID()
  eventId: string;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsString()
  paymentMethodId: string;
}
