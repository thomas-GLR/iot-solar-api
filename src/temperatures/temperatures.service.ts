import { Injectable } from '@nestjs/common';
import { Temperature } from './temperature.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReadingDevicesService } from '../reading-devices/reading-devices.service';
import { CreateTemperatureDto } from './create-temperature.dto';
import { ReadingDevice } from '../reading-devices/reading-device.entity';

@Injectable()
export class TemperaturesService {
  constructor(
    @InjectRepository(Temperature)
    private temperaturesRepository: Repository<Temperature>,
    private readingDevicesService: ReadingDevicesService,
  ) {}

  getAllTemperatures(): Promise<Temperature[]> {
    return this.temperaturesRepository.find({
      relations: ['readingDevice'],
    });
  }

  async getLastTemperatureForADevice(readingDevice: ReadingDevice) {
    return this.temperaturesRepository
      .createQueryBuilder('temperature')
      .where('temperature.readingDeviceId = :deviceId', {
        deviceId: readingDevice.id,
      })
      .orderBy('temperature.collectionDate', 'DESC')
      .leftJoinAndSelect('temperature.readingDevice', 'readingDevice')
      .getOne(); // Only get the latest one
  }

  async createTemperature(
    createTemperatureDto: CreateTemperatureDto,
  ): Promise<Temperature> {
    const currentDateTime = new Date();
    const readingDevice = await this.readingDevicesService.findByName(
      createTemperatureDto.sensorName,
    );

    const temperature = new Temperature();
    temperature.value = createTemperatureDto.value;
    temperature.collectionDate = currentDateTime;
    temperature.readingDevice = readingDevice;

    return await this.temperaturesRepository.save(temperature);
  }

  async getTemperaturesDetail(
    firstDate: Date,
    endDate: Date,
    readingDeviceName: string,
  ) {
    const readingDevice =
      await this.readingDevicesService.findByName(readingDeviceName);

    return this.temperaturesRepository
      .createQueryBuilder('temperature')
      .where('temperature.readingDeviceId = :deviceId', {
        deviceId: readingDevice.id,
      })
      .andWhere('temperature.collectionDate >= :firstDate', {
        firstDate: firstDate,
      })
      .andWhere('temperature.collectionDate < :endDate', {
        endDate: endDate,
      })
      .orderBy('temperature.collectionDate', 'DESC')
      .leftJoinAndSelect('temperature.readingDevice', 'readingDevice')
      .getMany();
  }
}
