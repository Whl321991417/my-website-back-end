import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiAgent } from './ai-agent.entity';
import { AiAgentsController } from './ai-agents.controller';
import { AiAgentsService } from './ai-agents.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AiAgent]),
  ],
  controllers: [AiAgentsController],
  providers: [AiAgentsService],
  exports: [AiAgentsService],
})
export class AiAgentsModule {}
