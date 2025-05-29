import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Parameter } from './parameter.entity';
import { ParameterController } from './parameter.controller';
import { ParameterService } from './parameter.service';

@Module({
  imports: [TypeOrmModule.forFeature([Parameter])],
  providers: [ParameterService],
  controllers: [ParameterController],
  exports: [ParameterService],
})
export class ParameterModule {}
