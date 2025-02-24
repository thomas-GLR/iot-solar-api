import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemperaturesModule } from './temperatures/temperatures.module';
import { ReadingDevicesModule } from './reading-devices/reading-devices.module';
import { Temperature } from './temperatures/temperature.entity';
import { ReadingDevice } from './reading-devices/reading-device.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { ResistanceStateModule } from './resistance-state/resistance-state.module';
import { ResistanceState } from './resistance-state/resistance-state.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { Users } from './users/users.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.production',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [Temperature, ReadingDevice, ResistanceState, Users],
        synchronize: false,
        timezone: 'Z',
        logging: true,
        connectTimeout: 30000,
        extra: {
          connectionLimit: 5,
          connectionTimeZone: 'UTC',
        },
      }),
      inject: [ConfigService],
    }),
    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: process.env.DATABASE_HOST,
    //   port: parseInt(process.env.DATABASE_PORT, 10),
    //   username: process.env.DATABASE_USERNAME,
    //   // username: 'root',
    //   password: process.env.DATABASE_PASSWORD,
    //   database: process.env.DATABASE_NAME,
    //   // database: 'iotsolar',
    //   entities: [Temperature, ReadingDevice],
    //   synchronize: true,
    //   autoLoadEntities: true,
    // }),
    TemperaturesModule,
    ReadingDevicesModule,
    ResistanceStateModule,
    UsersModule,
    AuthModule,
  ],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {
  constructor() {}
}
