import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResistanceState } from './resistance-state.entity';
import { ResistanceStateService } from './resistance-state.service';
import { ResistanceStateController } from './resistance-state.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ResistanceState])],
  providers: [ResistanceStateService],
  controllers: [ResistanceStateController],
})
export class ResistanceStateModule {}
