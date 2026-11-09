import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { PaquetesService } from './paquetes.service.js';
import { PaquetesController } from './paquetes.controller.js';

@Module({
  imports: [AuthModule],
  controllers: [PaquetesController],
  providers: [PaquetesService],
  exports: [PaquetesService],
})
export class PaquetesModule {}
