import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Parameter } from './parameter.entity';
import { Repository } from 'typeorm';
import { ParameterDto } from './parameter.dto';
import { EspParameterDto } from './esp-parameter.dto';

@Injectable()
export class ParameterService {
  constructor(
    @InjectRepository(Parameter)
    private parameterRepository: Repository<Parameter>,
  ) {}

  getParameter(name: string): Promise<Parameter | null> {
    return this.parameterRepository.findOneBy({ name });
  }

  getEspParameters(): Promise<Parameter[]> {
    return this.parameterRepository
      .createQueryBuilder('parameter')
      .where("parameter.name LIKE 'ESP%'")
      .getMany();
  }

  async updateParameter(parameterDto: ParameterDto) {
    const parameter = await this.getParameter(parameterDto.name);
    parameter.value = parameterDto.value;

    await this.parameterRepository.save(parameter);
  }

  async updateEspParameters(espParametersDto: EspParameterDto) {
    const espIp = await this.getParameter(espParametersDto.espIp.name);
    const espPort = await this.getParameter(espParametersDto.espPort.name);
    const espProtocol = await this.getParameter(
      espParametersDto.espProtocol.name,
    );
    espIp.value = espParametersDto.espIp.value;
    espPort.value = espParametersDto.espPort.value;
    espProtocol.value = espParametersDto.espProtocol.value;

    await this.parameterRepository.save(espIp);
    await this.parameterRepository.save(espPort);
    await this.parameterRepository.save(espProtocol);
  }

  async createParameter(parameterDto: ParameterDto) {
    const sameParameterExist = await this.getParameter(parameterDto.name);

    if (sameParameterExist === null) {
      const newParameter = new Parameter();
      newParameter.name = parameterDto.name;
      newParameter.value = parameterDto.value;

      await this.parameterRepository.save(newParameter);
    }
  }
}
