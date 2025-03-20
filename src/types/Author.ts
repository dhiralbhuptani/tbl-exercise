export interface Author {
  id: number;
  alternate_names?: string[];
  birth_date?: Date;
  key: string;
  name: string;
  top_subjects?: string[];
  top_work?: string;
  type: string;
  work_count?: string;
  ratings_average?: number;
  ratings_sortable?: number;
  ratings_count?: number;
  ratings_count_1?: number;
  ratings_count_2?: number;
  ratings_count_3?: number;
  ratings_count_4?: number;
  ratings_count_5?: number;
  want_to_read_count?: number;
  already_read_count?: number;
  currently_reading_count?: number;
  readinglog_count?: number;
  _version_: string;
}
