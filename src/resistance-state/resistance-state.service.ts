import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResistanceState } from './resistance-state.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ResistanceStateService {
  constructor(
    @InjectRepository(ResistanceState)
    private resistanceRepository: Repository<ResistanceState>,
  ) {}

  getLastResistanceState(): Promise<ResistanceState[]> {
    return this.resistanceRepository.find({
      order: { lastUpdate: 'DESC' },
    });
  }

  getAllResistanceState(): Promise<ResistanceState[]> {
    return this.resistanceRepository.find();
  }

  async createResitanceState(
    resistanceStatePartial: Partial<ResistanceState>,
  ): Promise<ResistanceState> {
    const resistanceState = this.resistanceRepository.create(
      resistanceStatePartial,
    );
    return await this.resistanceRepository.save(resistanceState);
  }
}
