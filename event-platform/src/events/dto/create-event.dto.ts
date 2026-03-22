import {
  IsString,
  IsNumber,
  IsDateString,
  IsPositive,
  IsInt,
  Min,
  IsOptional,
  IsArray,
  IsUUID,
} from 'class-validator';

export class CreateEventDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsDateString()
  date: string;

  @IsString()
  location: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsInt()
  @Min(1)
  capacity: number;

  @IsOptional()
  @IsUUID()
  venueId?: string;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  categoryIds?: string[];
}
