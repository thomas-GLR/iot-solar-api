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

@Controller('resistance')
export class ResistanceStateController {
  constructor(
    private readonly resistanceStateService: ResistanceStateService,
  ) {}

  @Get()
  async getLastResistanceState(): Promise<ResistanceStateDto> {
    const resistanceState =
      await this.resistanceStateService.getLastResistanceState();

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
  async create(@Body() resistanceStateDto: ResistanceStateDto) {
    const resistanceStatePartial: Partial<ResistanceState> = {
      lastUpdate: new Date(),
      currentState: resistanceStateDto.currentState,
    };

    return await this.resistanceStateService.createResitanceState(
      resistanceStatePartial,
    );
  }
}
