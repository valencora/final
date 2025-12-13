export interface IBlog {
  id: number;
  name?: string | null;
  handle?: string | null;
  description?: string | null;
}

export type NewBlog = Omit<IBlog, 'id'> & { id: null };
