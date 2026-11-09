// Importamos Injectable para inyección de dependencias y UnauthorizedException para errores de autenticación (HTTP 401)
import { Injectable, UnauthorizedException } from '@nestjs/common';
// Importamos JwtService de NestJS para firmar y emitir tokens de sesión
import { JwtService } from '@nestjs/jwt';
// Importamos UsersService para comunicarnos con la lógica de usuarios
import { UsersService } from '../users/users.service.js';
// Importamos las clases DTO de validación de datos de entrada
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
// Importamos bcrypt para comparar la contraseña ingresada contra el hash guardado
import * as bcrypt from 'bcrypt';

// Marcamos AuthService como inyectable para que AuthController pueda utilizarlo
@Injectable()
export class AuthService {
  // Inyectamos mediante el constructor tanto el servicio de Usuarios como el servicio de JWT de NestJS
  constructor(
    private readonly usersService: UsersService, // Servicio de usuarios inyectado
    private readonly jwtService: JwtService,     // Servicio de JWT inyectado
  ) {}

  // Método para procesar el registro de un nuevo usuario
  async register(registerDto: RegisterDto) {
    // Delegamos la creación del usuario y el encriptado de la clave a UsersService
    const user = await this.usersService.create(registerDto);
    // Generamos un token JWT válido para el usuario recién creado
    const token = this.generateToken(user.id, user.email, user.nombre);

    // Retornamos la respuesta completa indicando éxito
    return {
      message: 'Usuario registrado exitosamente', // Mensaje informativo
      user,                                       // Objeto del usuario (sin contraseña)
      accessToken: token,                         // Token JWT firmado
    };
  }

  // Método para autenticar un usuario existente y emitir su sesión
  async login(loginDto: LoginDto) {
    // Buscamos si existe un usuario registrado con el correo enviado en el formulario
    const user = await this.usersService.findByEmail(loginDto.email);

    // Si el usuario no existe en la base de datos, lanzamos una excepción 401 Unauthorized
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Comparamos en plano la contraseña enviada contra el hash encriptado de la base de datos usando bcrypt
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

    // Si la contraseña no coincide con el hash, lanzamos un error 401 Unauthorized
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Excluimos la contraseña del objeto de usuario que enviaremos en la respuesta
    const { password, ...userWithoutPassword } = user;
    // Generamos el token JWT firmado con el ID, email y nombre del usuario
    const token = this.generateToken(user.id, user.email, user.nombre);

    // Retornamos los datos del inicio de sesión exitoso
    return {
      message: 'Inicio de sesión exitoso', // Mensaje de éxito
      user: userWithoutPassword,          // Datos del usuario autenticado
      accessToken: token,                 // Token JWT firmado listo para persistir en localStorage
    };
  }

  // Método privado auxiliar para construir y firmar el token JWT
  private generateToken(userId: string, email: string, nombre: string) {
    // Definimos el payload (carga útil) con el id del usuario (sub), correo y nombre
    const payload = { sub: userId, email, nombre };
    // Firmamos el token usando la clave secreta JWT_SECRET definida en .env
    return this.jwtService.sign(payload);
  }
}
