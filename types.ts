
export enum Priority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export enum Category {
  WORK = 'Work',
  PERSONAL = 'Personal',
  SHOPPING = 'Shopping',
  HEALTH = 'Health',
  OTHER = 'Other'
}

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  category: Category;
  createdAt: number;
}

export interface AIAnalysis {
  category: Category;
  priority: Priority;
}
