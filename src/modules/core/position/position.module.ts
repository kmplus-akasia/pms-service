import { Module } from '@nestjs/common';
import { GetSuperiorByPositionService } from './services/get-superior-by-position.service';
import { GetSubordinateByPositionService } from './services/get-subordinate-by-position.service';

@Module({
  providers: [GetSuperiorByPositionService, GetSubordinateByPositionService],
  exports: [GetSuperiorByPositionService, GetSubordinateByPositionService],
})
export class PositionModule {}
