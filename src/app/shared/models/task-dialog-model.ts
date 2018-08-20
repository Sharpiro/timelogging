import { Task } from "./task";

export interface TaskDialogModel {
    categories: string[]
    currentTask?: Task
  }