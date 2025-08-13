import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { VotesModule } from '../votes/votes.module';

@Module({
  imports: [VotesModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
