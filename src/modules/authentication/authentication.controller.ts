import { Body, ClassSerializerInterceptor, Controller, HttpStatus, Inject, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { ActionResponse } from 'src/core/base/responses/action.response';
import { Router } from 'src/core/base/router';
import { UploadValidator } from 'src/core/validators/upload.validator';
import { AuthenticationService } from './authentication.service';
import { RegisterRequest } from './dto/requests/register.dto';
import { SendOtpRequest } from './dto/requests/send-otp.dto';
import { LoginRequest } from './dto/requests/signin.dto';
import { VerifyOtpRequest } from './dto/requests/verify-otp.dto';
import { AuthResponse } from './dto/responses/auth.response';
import { RegisterResponse } from './dto/responses/register.response';
import { RequestResetPassword } from './dto/requests/request-reset-password';
import { ResetPasswordRequest } from './dto/requests/reset-password';

@ApiTags(Router.Auth.ApiTag)
@Controller(Router.Auth.Base)
export class AuthenticationController {
  constructor(
    @Inject(AuthenticationService) private readonly authService: AuthenticationService,
  ) { }

  @Post(Router.Auth.Signin)
  async signin(
    @Body() req: LoginRequest,
  ): Promise<ActionResponse<AuthResponse>> {
    const authData = await this.authService.login(
      await this.authService.validateUser(req),
    );
    const result = plainToInstance(AuthResponse, authData, {
      excludeExtraneousValues: true,
    });
    console.log('result', result.avatar);
    console.log('result', result.avatar);

    result.role = authData.roles[0];
    return new ActionResponse<AuthResponse>(result);
  }


  @UseInterceptors(ClassSerializerInterceptor, FileInterceptor('avatarFile'))
  @ApiConsumes('multipart/form-data')
  @Post(Router.Auth.Register)
  async register(
    @Body() req: RegisterRequest,
    @UploadedFile(new UploadValidator().build())
    avatarFile: Express.Multer.File,
  ): Promise<ActionResponse<RegisterResponse>> {
    req.avatarFile = avatarFile;
    const user = await this.authService.register(req);
    console.log("user Register", user);
    const result = plainToInstance(RegisterResponse, user, {
      excludeExtraneousValues: true,
    });
    console.log("user Register result", result);

    return new ActionResponse<RegisterResponse>(result, {
      statusCode: HttpStatus.CREATED,
    });
  }

  @Post(Router.Auth.SendOtp)
  async snedOtp(@Body() req: SendOtpRequest): Promise<ActionResponse<string>> {
    const result = await this.authService.sendOtp(req);
    return new ActionResponse<string>(result.toString());
  }

  @Post(Router.Auth.VerifyOtp)
  async verifyOtp(
    @Body() req: VerifyOtpRequest,
  ): Promise<ActionResponse<AuthResponse>> {
    const data = await this.authService.verifyOtp(req);
    const result = plainToInstance(AuthResponse, data, {
      excludeExtraneousValues: true,
    });
    return new ActionResponse<AuthResponse>(result);
  }

  @Post(Router.Auth.RequestResetPasswordEmail)
  async requestResetPassword(@Body() req: RequestResetPassword): Promise<ActionResponse<boolean>> {
    const result = await this.authService.requestResetPassword(req);

    return new ActionResponse<boolean>(result);
  }

  @Post(Router.Auth.ResetPassword)
  async resetPassword(@Param("token") resetToken: string, @Body() req: ResetPasswordRequest): Promise<ActionResponse<AuthResponse>> {
    const result = await this.authService.resetPassword(resetToken, req);

    return new ActionResponse<AuthResponse>(result);
  }
}
