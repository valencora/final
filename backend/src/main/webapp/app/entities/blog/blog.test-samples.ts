import { IBlog, NewBlog } from './blog.model';

export const sampleWithRequiredData: IBlog = {
  id: 8379,
  name: 'simplistic breed liberalize',
  handle: 'inconsequential out',
};

export const sampleWithPartialData: IBlog = {
  id: 15714,
  name: 'aside quarrelsomely',
  handle: 'enthusiastically ugh',
};

export const sampleWithFullData: IBlog = {
  id: 16900,
  name: 'nor fowl',
  handle: 'failing per scratchy',
  description: '../fake-data/blob/hipster.txt',
};

export const sampleWithNewData: NewBlog = {
  name: 'however during',
  handle: 'quietly',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
