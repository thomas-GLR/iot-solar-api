import { Injectable } from '@nestjs/common';

@Injectable()
export class DateService {
  dateToUtc(date: Date): Date {
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  }
}
