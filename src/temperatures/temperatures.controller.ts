import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Query,
} from '@nestjs/common';
import { TemperatureDto } from './temperature.dto';
import { TemperaturesService } from './temperatures.service';
import { ReadingDevicesService } from '../reading-devices/reading-devices.service';
import { CreateTemperatureDto } from './create-temperature.dto';
import { AggregationType } from './AggregationType';
import { Temperature } from './temperature.entity';
import { DateService } from '../utils/date.service';

@Controller('temperatures')
export class TemperaturesController {
  private readonly logger = new Logger(TemperaturesController.name);

  constructor(
    private temperaturesService: TemperaturesService,
    private readingDevicesService: ReadingDevicesService,
    private dateService: DateService,
  ) {}

  @Get()
  async getAllTemperatures(
    @Query('aggregation_type') aggregationType?: AggregationType,
    @Query('start_date') startDate?: Date,
    @Query('end_date') endDate?: Date,
  ): Promise<TemperatureDto[]> {
    let temperaturesDtos: TemperatureDto[] = [];
    await this.temperaturesService.getAllTemperatures().then((temperatures) => {
      if (startDate !== undefined && endDate !== undefined) {
        temperatures = temperatures.filter(
          (temperature) =>
            temperature.collectionDate >= new Date(startDate) &&
            temperature.collectionDate <= new Date(endDate),
        );
      }

      console.log(aggregationType);
      console.log(startDate);
      console.log(endDate);

      if (aggregationType !== undefined) {
        const temperaturesByDateByReadingDevice = new Map<
          string,
          Map<string, Temperature[]>
        >();

        for (const temperature of temperatures) {
          const readingDeviceName = temperature.readingDevice.name;
          let cle = temperature.collectionDate.toUTCString();

          const year = temperature.collectionDate.getUTCFullYear();
          const month = temperature.collectionDate.getUTCMonth();
          const day = temperature.collectionDate.getUTCDate();
          const hours = temperature.collectionDate.getUTCHours();
          const minutes = temperature.collectionDate.getUTCMinutes();

          switch (aggregationType) {
            case AggregationType.HOURS:
              cle = new Date(year, month, day, hours, minutes).toUTCString();
              break;
            case AggregationType.DAYS:
              cle = new Date(year, month, day, hours).toUTCString();
              break;
            case AggregationType.MONTHS:
              cle = new Date(year, month, day).toUTCString();
              break;
            case AggregationType.YEARS:
              cle = new Date(year, month, 1).toUTCString();
              break;
          }

          if (!temperaturesByDateByReadingDevice.has(readingDeviceName)) {
            temperaturesByDateByReadingDevice.set(readingDeviceName, new Map());
          }
          if (
            !temperaturesByDateByReadingDevice.get(readingDeviceName).has(cle)
          ) {
            temperaturesByDateByReadingDevice
              .get(readingDeviceName)
              .set(cle, []);
          }
          temperaturesByDateByReadingDevice
            .get(readingDeviceName)
            .get(cle)!
            .push(temperature);
        }

        for (const readingDeviceName of temperaturesByDateByReadingDevice.keys()) {
          for (const date of temperaturesByDateByReadingDevice
            .get(readingDeviceName)
            .keys()) {
            const currentTemperatures = temperaturesByDateByReadingDevice
              .get(readingDeviceName)
              .get(date);
            const sum = currentTemperatures.reduce(
              (acc, temperature) => acc + temperature.value,
              0,
            );
            const averageTemperature =
              currentTemperatures.length > 0
                ? sum / currentTemperatures.length
                : 0;

            temperaturesDtos.push(<TemperatureDto>{
              id: null,
              value: averageTemperature,
              // On prend une température au hasard car elles auront tous la même date en fonction du type d'aggrégation
              collectionDate: this.dateService.UTCToZonedTime(
                currentTemperatures[0].collectionDate,
              ),
              readingDeviceName: readingDeviceName,
            });
          }
        }

        return temperaturesDtos.sort(
          (a, b) =>
            this.dateService.zonedTimeToUTC(b.collectionDate).getDate() -
            this.dateService.zonedTimeToUTC(a.collectionDate).getDate(),
        );
      }
      temperaturesDtos = temperatures
        .sort((a, b) => b.collectionDateToDate() - a.collectionDateToDate())
        .map((temperature) => {
          return <TemperatureDto>{
            id: temperature.id,
            value: temperature.value,
            collectionDate: this.dateService.UTCToZonedTime(
              temperature.collectionDate,
            ),
            readingDeviceName: temperature.readingDevice.name,
          };
        });
    });

    return temperaturesDtos;
  }

  @Post()
  // @UseGuards(LocalNetworkGuard)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createTemperatureDto: CreateTemperatureDto) {
    this.temperaturesService.createTemperature(createTemperatureDto);
  }

  @Get('last-temperatures')
  async getLastTemperaturesFromReadingDevice(): Promise<TemperatureDto[]> {
    const temperatures: TemperatureDto[] = [];
    const readingDevices = await this.readingDevicesService.findAll();

    for (const readingDevice of readingDevices) {
      const lastTemperature =
        await this.temperaturesService.getLastTemperatureForADevice(
          readingDevice,
        );

      this.logger.log(lastTemperature);

      temperatures.push(<TemperatureDto>{
        id: lastTemperature.id,
        value: lastTemperature.value,
        collectionDate: this.dateService.UTCToZonedTime(
          lastTemperature.collectionDate,
        ),
        readingDeviceName: readingDevice.name,
      });
    }

    return temperatures;
  }
}
