import { Injectable } from '@nestjs/common';
import { toZonedTime, format, fromZonedTime } from 'date-fns-tz';

@Injectable()
export class DateService {
  private TIME_ZONE = 'Europe/Paris';

  dateToUtc(date: Date): Date {
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  }

  UTCToZonedTime(dateToConvert: Date): string {
    const parisDate = toZonedTime(dateToConvert, this.TIME_ZONE);
    return format(parisDate, "yyyy-MM-dd'T'HH:mm:ssXXX", {
      timeZone: 'Europe/Paris',
    });
  }

  zonedTimeToUTC(zonedTimeToConvert: string): Date {
    return fromZonedTime(zonedTimeToConvert, this.TIME_ZONE);
  }
}
