import { Injectable, NotAcceptableException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    username: string,
    pass: string,
  ): Promise<{ accessToken: string, refreshToken: string }> {
    const user = await this.usersService.findByUsername(username);

    const passwordValid = await bcrypt.compare(pass, user?.password);

    if (!passwordValid) {
      throw new UnauthorizedException();
    }

    return this.login(user)
  }

  async login(user: any): Promise<{ accessToken: string, refreshToken: string }> {
    const payload = { username: user.username, sub: user._id };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '10m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    const saltOrRounds = 10;
    const hashedRefreshToken = await bcrypt.hash(refreshToken, saltOrRounds);

    await this.usersService.updateRefreshToken(user.id, hashedRefreshToken);

    return { accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string) {
    try {
      const decoded = this.jwtService.verify(refreshToken);
      const user = await this.usersService.findById(decoded.sub);

      const isRefreshTokenValid = await bcrypt.compare(refreshToken, user?.refreshToken);

      if (!user || !isRefreshTokenValid) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return this.login(user);
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
