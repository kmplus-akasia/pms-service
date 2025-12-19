import { Module, Global } from '@nestjs/common';
import { FileService } from './file.service';
import { MysqlModule } from '../database/mysql.module';

@Global()
@Module({
  imports: [MysqlModule],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
