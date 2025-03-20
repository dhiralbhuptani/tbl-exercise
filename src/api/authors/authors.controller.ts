import { Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { Request } from 'express';

import { AuthorsService } from './authors.service';
import { Author } from 'src/types/Author';

@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @Post(':authorName')
  async create(
    @Req() request: Request,
    @Param('authorName') authorName: string,
  ): Promise<{ authors: Author[]; message: string }> {
    const { authors, message } = await this.authorsService.create(authorName);
    return {
      message,
      authors,
    };
  }

  @Get()
  async findAll(
    @Query('page') page: string,
    @Query('limit') limit: string,
  ): Promise<{
    authors: Author[];
    total: number;
    page: number;
    limit: number;
    message: string;
  }> {
    const { authors, total, message } = await this.authorsService.findAll(
      +page,
      +limit,
    );
    return {
      message,
      authors,
      total,
      page: +page,
      limit: +limit,
    };
  }

  @Get(':authorId')
  async find(
    @Param('authorId') authorId: number,
  ): Promise<{ author: Author[]; message: string }> {
    const { author, message } = await this.authorsService.find(authorId);
    return {
      message,
      author,
    };
  }
}
