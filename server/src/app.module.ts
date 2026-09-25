import { Module } from '@nestjs/common';
import { ClaimsController } from './controller/claims.controller.js'
import { ClaimsService } from './services/claims.service.js'
import { OpenAiService } from './services/openai.service.js'
import { PrismaService } from './services/prisma.service.js'

@Module({
  controllers: [ClaimsController],
  providers: [ClaimsService, OpenAiService, PrismaService],
})
export class AppModule {}