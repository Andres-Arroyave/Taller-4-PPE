// Importamos los decoradores y la excepción de no autorizado de NestJS
import { Injectable, UnauthorizedException } from '@nestjs/common';
// Importamos PassportStrategy para integrar la estrategia de autenticación JWT
import { PassportStrategy } from '@nestjs/passport';
// Importamos la estrategia nativa de passport-jwt y el extractor del header Bearer
import { ExtractJwt, Strategy } from 'passport-jwt';
// Importamos UsersService para verificar la existencia del usuario en cada petición protegida
import { UsersService } from '../users/users.service.js';

// Marcamos JwtStrategy como inyectable para que PassportModule lo administre
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  // Configuración de la estrategia en el constructor
  constructor(private readonly usersService: UsersService) {
    super({
      // Extrae automáticamente el token desde el header 'Authorization: Bearer <token>'
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Rechaza tokens que hayan superado su tiempo de vida (expirados)
      ignoreExpiration: false,
      // Utiliza la clave secreta declarada en process.env.JWT_SECRET para descifrar y verificar la firma
      secretOrKey: process.env.JWT_SECRET || 'super_secret_jwt_key_taller1_2026',
    });
  }

  // Método que ejecuta Passport automáticamente si el token pasó la verificación matemática de la firma
  async validate(payload: { sub: string; email: string }) {
    // Buscamos en SQLite el usuario cuyo ID viene dentro del token (payload.sub)
    const user = await this.usersService.findById(payload.sub);
    // Si el usuario ya no existe o fue borrado de la base de datos, rechazamos con 401
    if (!user) {
      throw new UnauthorizedException('Token inválido o usuario no existe');
    }
    // Retornamos el usuario; NestJS lo inyectará automáticamente en 'req.user' en los controladores protegidos
    return user;
  }
}
