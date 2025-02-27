import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async findByUsername(username: string): Promise<Users> {
    return this.usersRepository.findOneBy({
      username: username,
    });
  }

  async findById(id: number): Promise<Users | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async updateRefreshToken(id: number, refreshToken: string) {
    await this.usersRepository.update(id, { refreshToken });
  }

  async clearRefreshToken(id: number) {
    await this.usersRepository.update(id, { refreshToken: null });
  }
}
