// Importamos los decoradores de NestJS para manejar el ciclo de vida y la inyección de dependencias
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
// Importamos el cliente oficial autogenerado por Prisma
import { PrismaClient } from '@prisma/client';
// Importamos el adaptador oficial de Prisma 7 para SQLite
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

// El decorador @Injectable marca esta clase para que NestJS pueda inyectarla en otros servicios
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  // El constructor inicializa la conexión con SQLite usando el adaptador de Prisma 7
  constructor() {
    // Instanciamos el adaptador leyendo la variable de entorno DATABASE_URL
    const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL || 'file:./dev.db' });
    // Pasamos el adaptador al constructor de la clase padre (PrismaClient)
    super({ adapter });
  }

  // Método del ciclo de vida de NestJS que se ejecuta automáticamente cuando el módulo inicia
  async onModuleInit() {
    // Abrimos la conexión con la base de datos SQLite
    await this.$connect();
  }

  // Método del ciclo de vida de NestJS que se ejecuta cuando la aplicación se apaga
  async onModuleDestroy() {
    // Cerramos la conexión con la base de datos para evitar fugas de memoria
    await this.$disconnect();
  }
}
