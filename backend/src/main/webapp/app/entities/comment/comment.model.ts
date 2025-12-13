import dayjs from 'dayjs/esm';
import { IPost } from 'app/entities/post/post.model';

export interface IComment {
  id: number;
  text?: string | null;
  date?: dayjs.Dayjs | null;
  post?: Pick<IPost, 'id' | 'title'> | null;
}

export type NewComment = Omit<IComment, 'id'> & { id: null };
