/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class PostsService {
  constructor(private readonly prismaService: PrismaService) {}
  getPosts(): string {
    return JSON.stringify(this.prismaService.post.findMany({}));
  }

  createPost(body: any) {
    return this.prismaService.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: body.authorId,
      },
    });
  }

  getPost(id: string): string {
    return `This action returns a #${id} post`;
  }

  updatePost(id: string, body: any): string {
    return `This action updates a #${id} post with data ${JSON.stringify(body)}`;
  }

  deletePost(id: string): string {
    return `This action removes a #${id} post`;
  }
}
