import { JwtService } from '@nestjs/jwt';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { LoginRequest } from './dto/requests/signin.dto';
import { Inject } from '@nestjs/common/decorators';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { RegisterRequest } from './dto/requests/register.dto';
import { SendOtpRequest } from './dto/requests/send-otp.dto';
import { VerifyOtpRequest } from './dto/requests/verify-otp.dto';
import { RegisterUserTransaction } from './transactions/register-user.transaction';
import { SendOtpTransaction } from './transactions/send-otp.transaction';
import { UserService } from '../user/user.service';
import { VerifyOtpTransaction } from './transactions/verify-otp.transaction';
import { jwtSignOptions } from 'src/core/setups/jwt.setup';
import { RequestResetPassword } from './dto/requests/request-reset-password';
import { SendEmailService } from '../send-email/send-email.service';
import { readEnv } from 'src/core/helpers/env.helper';
import { ResetPasswordRequest } from './dto/requests/reset-password';

@Injectable()
export class AuthenticationService {
  constructor(
    @Inject(UserService) private readonly userService: UserService,
    @Inject(RegisterUserTransaction) private readonly registerUserTransaction: RegisterUserTransaction,
    @Inject(SendOtpTransaction) private readonly sendOtpTransaction: SendOtpTransaction,
    @Inject(VerifyOtpTransaction) private readonly verifyOtpTransaction: VerifyOtpTransaction,
    @Inject(JwtService) private readonly jwtService: JwtService,
    @Inject(ConfigService) private readonly _config: ConfigService,
    @Inject(SendEmailService) private readonly sendEmailService: SendEmailService,
  ) { }

  async validateUser(req: LoginRequest): Promise<any> {
    const user = await this.userService.findOne([
      { email: req.username },
      { username: req.username },
      { phone: req.username },
    ] as any);
    let isMatch = false;
    if (user) {
      isMatch = await bcrypt.compare(
        req.password + this._config.get('app.key'),
        user.password,
      );
    }
    if (user && isMatch) {
      return user;
    }
    return null;
  }

  async login(user: any) {
    if (!user) throw new BadRequestException('Email or password is incorrect');
    const payload = { username: user.username, sub: user.id };
    return {
      ...user,
      access_token: this.jwtService.sign(payload, jwtSignOptions(this._config)),
    };
  }

  async register(req: RegisterRequest) {
    const user = await this.registerUserTransaction.run(req);
    return user;
  }

  async sendOtp(req: SendOtpRequest) {
    return await this.sendOtpTransaction.run(req);
  }

  async verifyOtp(req: VerifyOtpRequest) {
    return await this.verifyOtpTransaction.run(req);
  }

  async requestResetPassword(req: RequestResetPassword) {
    const user = await this.userService.findOne([
      { email: req.email },
    ] as any);

    if (!user) {
      throw new BadRequestException('Email not found');
    }

    const token = this.jwtService.sign({ username: user.username }, { secret: this._config.get<string>('app.key'), expiresIn: '1h' })
    const resetPasswordUrl = readEnv('APP_HOST') + '/v1/auth/reset-password/' + token;

    await this.sendEmailService.sendResetPasswordEmail(user.email, resetPasswordUrl);

    return true;
  }

  async resetPassword(resetToken: string, req: ResetPasswordRequest) {
    const { newPassword } = req;
    const payload = this.jwtService.verify(resetToken, { secret: this._config.get<string>('app.key') });
    const user = await this.userService.findOne([
      { username: payload.username },
    ] as any);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    user.password = await bcrypt.hash(newPassword + this._config.get('app.key'), 10);
    await user.save();

    const newPayload = { username: user.username, sub: user.id };
    return {
      ...user,
      access_token: this.jwtService.sign(newPayload, jwtSignOptions(this._config)),
    };
  }
}
