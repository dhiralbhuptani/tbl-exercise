import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { catchError, firstValueFrom } from 'rxjs';
import { Author } from 'src/types/Author';

interface OpenLibraryAuthorResponse {
  numFound: number;
  start: number;
  numFoundExact: boolean;
  docs: Author[];
}

@Injectable()
export class AuthorsService {
  private readonly openLibraryApiUrl: string = process.env.OPEN_LIBRARY_API!;
  private readonly logger = new Logger(AuthorsService.name);

  constructor(
    @InjectConnection() private readonly knex: Knex,
    private readonly httpService: HttpService,
  ) {}

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    authors: Author[];
    total: number;

    message: string;
  }> {
    const [authors, total] = await Promise.all([
      this.knex<Author>('authors')
        .select('*')
        .offset((page - 1) * limit)
        .limit(limit),
      this.knex('authors').count('* as total').first(),
    ]);
    this.logger.debug(total);
    return {
      authors,
      total: Number(total?.total || 0),
      message: 'Authors list fetched successfully.',
    };
  }

  async find(authorId: number): Promise<{ author: Author[]; message: string }> {
    const author = await this.knex<Author>('authors')
      .where('id', authorId)
      .select('*');
    return { author, message: 'Author data fetched successfully.' };
  }

  async create(
    authorName: string,
  ): Promise<{ authors: Author[]; message: string }> {
    let message: string = 'Authors successfully added in the database.';
    const { data } = await firstValueFrom(
      this.httpService
        .get<OpenLibraryAuthorResponse>(
          `${this.openLibraryApiUrl}?q=${encodeURIComponent(authorName)}`,
        )
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response?.data);
            throw new Error('Error fetching author');
          }),
        ),
    );

    if (!data.docs.length) {
      message = 'No authors found from the API.';
      return { authors: [], message };
    }

    const otherVersions = data.docs.map((author) => author._version_);
    const existingAuthors = await this.knex<Author>('authors').whereIn(
      '_version_',
      otherVersions,
    );

    if (existingAuthors.length === data.docs.length) {
      message = 'All authors are already existing in the database.';
      return { authors: [], message };
    }

    const existingVersions = new Set(existingAuthors.map((a) => a._version_));
    const newAuthors = data.docs.filter(
      (author) => !existingVersions.has(author._version_),
    );

    if (newAuthors.length) {
      await this.knex('authors').insert(
        newAuthors.map((author) => ({
          alternate_names: JSON.stringify(author.alternate_names),
          birth_date: author.birth_date,
          key: author.key,
          name: author.name,
          top_subjects: JSON.stringify(author.top_subjects),
          top_work: author.top_work,
          type: author.type,
          work_count: author.work_count,
          ratings_average: author.ratings_average,
          ratings_sortable: author.ratings_sortable,
          ratings_count: author.ratings_count,
          ratings_count_1: author.ratings_count_1,
          ratings_count_2: author.ratings_count_2,
          ratings_count_3: author.ratings_count_3,
          ratings_count_4: author.ratings_count_4,
          ratings_count_5: author.ratings_count_5,
          want_to_read_count: author.want_to_read_count,
          already_read_count: author.already_read_count,
          currently_reading_count: author.currently_reading_count,
          readinglog_count: author.readinglog_count,
          _version_: author._version_,
        })),
      );

      this.logger.log(
        `${newAuthors.length} new authors inserted into the database.`,
      );
    }

    return {
      authors: newAuthors,
      message,
    };
  }
}
