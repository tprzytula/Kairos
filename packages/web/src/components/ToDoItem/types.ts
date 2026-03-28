import { IStep } from '../../api/toDoList/retrieve/types'

export interface ITodoItemProps {
    id: string;
    name: string;
    description?: string;
    isDone: boolean;
    dueDate?: number;
    steps?: IStep[];
    visibility?: "private";
}
