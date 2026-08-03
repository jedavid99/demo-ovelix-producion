import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { RegisterDeveloperDto } from './dto/register-developer.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';
@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 intentos por minuto
  @ApiOperation({ summary: 'Iniciar sesión con credenciales' })
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Public()
  @ApiOperation({ summary: 'Renovar token de acceso con refresh token' })
  @Post('refresh')
  async refresh(@Body() refreshDto: RefreshDto) {
    return this.authService.refresh(refreshDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cerrar sesión del usuario autenticado' })
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Request() req) {
    await this.authService.logout(req.user.id);
    return { message: 'Logout exitoso' };
  }

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 registros por minuto
  @ApiOperation({ summary: 'Registrar un nuevo usuario desarrollador' })
  @Post('register-developer')
  async registerDeveloper(@Body() registerDeveloperDto: RegisterDeveloperDto) {
    return this.authService.registerDeveloper(registerDeveloperDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener datos del usuario autenticado' })
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Request() req) {
    return this.authService.me(req.user.id);
  }
}
