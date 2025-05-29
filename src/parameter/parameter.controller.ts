import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ParameterService } from './parameter.service';
import { EspParameterDto } from './esp-parameter.dto';
import { ParameterDto } from './parameter.dto';
import { ParameterName } from './parameter-name';

@Controller('parameter')
export class ParameterController {
  constructor(private parameterService: ParameterService) {}

  @Get()
  async getParameter(@Query('name') name: string): Promise<ParameterDto> {
    const parameter = await this.parameterService.getParameter(name);
    if (parameter === null) {
      throw new NotFoundException();
    }
    return parameter;
  }

  @Get('esp')
  async getParameters() {
    const parameters = await this.parameterService.getEspParameters();

    if (parameters.length === 0) {
      throw new NotFoundException();
    }

    const espIp: ParameterDto = parameters.find(
      (parameter) => parameter.name === ParameterName.ESP_IP,
    );
    const espPort: ParameterDto = parameters.find(
      (parameter) => parameter.name === ParameterName.ESP_PORT,
    );
    const espProtocol: ParameterDto = parameters.find(
      (parameter) => parameter.name === ParameterName.ESP_PROTOCOL,
    );

    return <EspParameterDto>{
      espIp: espIp,
      espPort: espPort,
      espProtocol: espProtocol,
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() parameterDto: ParameterDto) {
    this.parameterService.createParameter(parameterDto);
  }

  @Put()
  update(@Body() parameter: ParameterDto) {
    this.parameterService.updateParameter(parameter);
  }

  @Put('esp')
  updateEspParameters(@Body() espParameters: EspParameterDto) {
    this.parameterService.updateEspParameters(espParameters);
  }
}
