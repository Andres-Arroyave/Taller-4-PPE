// Importamos decoradores de NestJS para controladores, rutas POST y estados HTTP
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
// Importamos AuthService que contiene la lógica de negocio del registro y login
import { AuthService } from './auth.service.js';
// Importamos los DTOs que validan las estructuras del cuerpo de las peticiones HTTP
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';

// El decorador @Controller('auth') define la ruta base HTTP del grupo: http://localhost:3000/auth
@Controller('auth')
export class AuthController {
  // Inyectamos AuthService mediante el constructor para poder invocar sus métodos
  constructor(private readonly authService: AuthService) {}

  // Decorador @Post('register') mapea las peticiones HTTP POST hacia http://localhost:3000/auth/register
  @Post('register')
  // Método handler: @Body() extrae y valida el JSON recibido usando RegisterDto
  register(@Body() registerDto: RegisterDto) {
    // Delegamos el proceso de registro al servicio de autenticación
    return this.authService.register(registerDto);
  }

  // Establecemos que este endpoint retorne un código de estado HTTP 200 OK en lugar del 201 por defecto
  @HttpCode(HttpStatus.OK)
  // Decorador @Post('login') mapea las peticiones HTTP POST hacia http://localhost:3000/auth/login
  @Post('login')
  // Método handler: @Body() extrae y valida el email y contraseña usando LoginDto
  login(@Body() loginDto: LoginDto) {
    // Delegamos el proceso de autenticación e inicio de sesión a AuthService
    return this.authService.login(loginDto);
  }
}
