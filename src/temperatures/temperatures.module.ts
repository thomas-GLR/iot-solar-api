import { Module } from '@nestjs/common';
import { Temperature } from './temperature.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemperaturesService } from './temperatures.service';
import { TemperaturesController } from './temperatures.controller';
import { ReadingDevicesModule } from '../reading-devices/reading-devices.module';
import { DateService } from '../utils/date.service';

@Module({
  imports: [TypeOrmModule.forFeature([Temperature]), ReadingDevicesModule],
  providers: [TemperaturesService, DateService],
  controllers: [TemperaturesController],
})
export class TemperaturesModule {}
