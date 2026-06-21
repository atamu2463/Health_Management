import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()  // アプリ全体でimportなしに使えるようにする
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}