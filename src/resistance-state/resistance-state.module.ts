import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResistanceState } from './resistance-state.entity';
import { ResistanceStateService } from './resistance-state.service';
import { ResistanceStateController } from './resistance-state.controller';
import { UtilsModule } from '../utils/utils.module';
import { ParameterModule } from '../parameter/parameter.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ResistanceState]),
    UtilsModule,
    ParameterModule,
  ],
  providers: [ResistanceStateService],
  controllers: [ResistanceStateController],
})
export class ResistanceStateModule {}
