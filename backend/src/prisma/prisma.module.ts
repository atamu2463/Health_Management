import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma.service';

@Module({
  //起動時にNestJS側へ環境変数を確実にロードさせる
  imports: [
    ConfigModule.forRoot({ isGlobal: true })
  ],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}