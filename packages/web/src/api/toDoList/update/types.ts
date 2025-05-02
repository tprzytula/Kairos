import { ITodoItem } from '../retrieve/types';

export type ITodoItemUpdate = Pick<ITodoItem, 'id' | 'isDone'>;
