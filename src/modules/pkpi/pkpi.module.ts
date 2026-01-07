import { Module } from '@nestjs/common';
import { PkpiController } from './controllers/pkpi.controller';
import { PkpiService } from './services/pkpi.service';
import { PkpiIntegrationService } from './services/pkpi-integration.service';

@Module({
  controllers: [PkpiController],
  providers: [PkpiService, PkpiIntegrationService],
  exports: [PkpiService, PkpiIntegrationService],
})
export class PkpiModule {}
