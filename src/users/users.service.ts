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
  // async createUser(username: string, password: string): Promise<Users> {
  //   const user = this.usersRepository.create({
  //     username: username,
  //     password: password,
  //   });
  //
  //   return this.usersRepository.save(user);
  // }
  async findByUsername(username: string): Promise<Users> {
    return this.usersRepository.findOneBy({
      username: username,
    });
  }
}
