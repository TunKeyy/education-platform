import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto, UpdatePostDto, QueryPostsDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../auth/decorators/user.decorator';
import type { RequestUser } from '../auth/decorators/user.decorator';

@Controller('v1/posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createPostDto: CreatePostDto, @User() user: RequestUser) {
    return this.postsService.createPost(createPostDto, user.id);
  }

  @Get()
  findAll(@Query() queryDto: QueryPostsDto) {
    return this.postsService.findAll(queryDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @User() user: RequestUser,
  ) {
    return this.postsService.updatePost(id, updatePostDto, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @User() user: RequestUser) {
    return this.postsService.deletePost(id, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/publish')
  publish(@Param('id') id: string, @User() user: RequestUser) {
    return this.postsService.publishPost(id, user.id);
  }
}
