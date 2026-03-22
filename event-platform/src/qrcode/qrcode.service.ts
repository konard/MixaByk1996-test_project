import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class QrCodeService {
  constructor(
    @InjectQueue('qrcode')
    private qrCodeQueue: Queue,
  ) {}

  async generateQrCode(ticketId: string, userId: string): Promise<void> {
    await this.qrCodeQueue.add('generate', {
      ticketId,
      userId,
    });
  }
}
