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

  async sendRequestToEsp32(swithOnResistance: boolean) {
    const esp32IpAddress = process.env.ESP_IP_ADDRESS;
    const esp32Port = process.env.ESP_PORT;

    const parameter = swithOnResistance ? '1' : '0';

    try {
      return await axios.get(
        `http://${esp32IpAddress}:${esp32Port}/${parameter}`,
      );
    } catch (error) {
      throw error;
    }
  }
}
