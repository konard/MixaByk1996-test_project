import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { PurchaseTicketDto } from './dto/purchase-ticket.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User, UserRole } from '../users/user.entity';

@Controller('tickets')
@UseGuards(JwtAuthGuard)
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post('purchase')
  purchase(
    @Body() purchaseTicketDto: PurchaseTicketDto,
    @CurrentUser() user: User,
  ) {
    return this.ticketsService.purchase(purchaseTicketDto, user.id);
  }

  @Get()
  findAll(@CurrentUser() user: User) {
    if (user.role === UserRole.ADMIN) {
      return this.ticketsService.findAll();
    }
    return this.ticketsService.findAll(user.id);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.ticketsService.findOne(id);
  }
}
