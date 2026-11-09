// Importamos el decorador Injectable y la excepción ConflictException de NestJS
import { Injectable, ConflictException } from '@nestjs/common';
// Importamos nuestro servicio de Prisma para consultar la base de datos
import { PrismaService } from '../prisma/prisma.service.js';
// Importamos la librería bcrypt para encriptar y comparar contraseñas
import * as bcrypt from 'bcrypt';

// Decorador que permite a NestJS inyectar UsersService en otros módulos (como AuthModule)
@Injectable()
export class UsersService {
  // Inyección de dependencias: NestJS entrega una instancia de PrismaService en la propiedad privada prisma
  constructor(private readonly prisma: PrismaService) {}

  // Método para registrar un usuario en la base de datos con contraseña encriptada
  async create(data: { email: string; nombre: string; password: string }) {
    // Buscamos en la tabla User si ya existe un usuario registrado con el mismo correo electrónico
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    // Si el correo ya existe, lanzamos un error 409 Conflict impidiendo el registro duplicado
    if (existingUser) {
      throw new ConflictException('El correo electrónico ya está registrado');
    }

    // Encriptamos la contraseña en plano usando bcrypt con 10 rondas de complejidad (salt)
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Creamos el nuevo registro de usuario en la base de datos SQLite
    const user = await this.prisma.user.create({
      data: {
        email: data.email,       // Asignamos el correo recibido
        nombre: data.nombre,     // Asignamos el nombre completo
        password: hashedPassword, // Guardamos la contraseña encriptada (nunca en texto plano)
      },
    });

    // Desestructuramos el objeto para separar la contraseña del resto de datos
    const { password, ...userWithoutPassword } = user;
    // Retornamos el usuario recién creado omitiendo la contraseña por seguridad
    return userWithoutPassword;
  }

  // Método para buscar un usuario por su correo electrónico (usado durante el Login)
  async findByEmail(email: string) {
    // Consultamos la tabla User buscando coincidencia exacta con el email recibido
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  // Método para buscar un usuario por su ID único (usado al validar el token JWT)
  async findById(id: string) {
    // Consultamos la tabla User en la base de datos usando la clave primaria id
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    // Si el usuario no existe, retornamos null
    if (!user) return null;

    // Removemos la contraseña del objeto retornado por seguridad
    const { password, ...userWithoutPassword } = user;
    // Retornamos los datos públicos del usuario
    return userWithoutPassword;
  }
}
