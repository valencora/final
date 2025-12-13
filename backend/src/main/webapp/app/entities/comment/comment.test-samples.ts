import dayjs from 'dayjs/esm';

import { IComment, NewComment } from './comment.model';

export const sampleWithRequiredData: IComment = {
  id: 20452,
  text: '../fake-data/blob/hipster.txt',
  date: dayjs('2025-12-13T11:35'),
};

export const sampleWithPartialData: IComment = {
  id: 12398,
  text: '../fake-data/blob/hipster.txt',
  date: dayjs('2025-12-13T00:36'),
};

export const sampleWithFullData: IComment = {
  id: 28427,
  text: '../fake-data/blob/hipster.txt',
  date: dayjs('2025-12-13T09:21'),
};

export const sampleWithNewData: NewComment = {
  text: '../fake-data/blob/hipster.txt',
  date: dayjs('2025-12-13T18:21'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
