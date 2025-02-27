import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ResistanceStateDto } from './resistance-state.dto';
import { ResistanceStateService } from './resistance-state.service';
import { ResistanceState } from './resistance-state.entity';
import { DateService } from '../utils/date.service';

@Controller('resistance')
export class ResistanceStateController {
  constructor(
    private readonly resistanceStateService: ResistanceStateService,
    private readonly dateservice: DateService,
  ) {}

  @Get()
  async getLastResistanceState(): Promise<ResistanceStateDto> {
    const resistancesStates =
      await this.resistanceStateService.getLastResistanceState();

    if (resistancesStates.length === 0) {
      return {
        id: null,
        lastUpdate: this.dateservice.dateToUtc(new Date()),
        currentState: false,
      };
    }
    const resistanceState = resistancesStates[0];

    return <ResistanceStateDto>{
      id: resistanceState.id,
      lastUpdate: resistanceState.lastUpdate,
      currentState: resistanceState.currentState,
    };
  }

  @Get()
  async getAllResistanceState(): Promise<ResistanceStateDto[]> {
    return await this.resistanceStateService.getAllResistanceState();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() resistanceState: ResistanceState) {
    const resistanceStatePartial: Partial<ResistanceState> = {
      lastUpdate: this.dateservice.dateToUtc(new Date()),
      currentState: resistanceState.currentState,
    };

    return await this.resistanceStateService.createResitanceState(
      resistanceStatePartial,
    );
  }
}
