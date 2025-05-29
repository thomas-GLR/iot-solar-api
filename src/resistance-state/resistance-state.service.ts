import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResistanceState } from './resistance-state.entity';
import { Repository } from 'typeorm';
import axios from 'axios';

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

  async sendRequestToEsp32(
    espIp: string,
    espPort: string,
    espProtocol: string,
    swithOnResistance: boolean,
  ) {
    const parameter = swithOnResistance ? '1' : '0';

    try {
      return await axios.get(
        `${espProtocol}://${espIp}:${espPort}/resistance/${parameter}`,
      );
    } catch (error) {
      throw error;
    }
  }
}
