import { Module } from '@nestjs/common';
import { PositionController } from './controllers/position.controller';
import { PositionModule as CorePositionModule } from '../core/position/position.module';

@Module({
  imports: [CorePositionModule],
  controllers: [PositionController],
})
export class PositionModule {}
