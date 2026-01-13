
import React from 'react';
import { Todo, Priority, Category } from '../types';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const priorityColors = {
  [Priority.LOW]: 'bg-slate-100 text-slate-600 border-slate-200',
  [Priority.MEDIUM]: 'bg-amber-50 text-amber-700 border-amber-200',
  [Priority.HIGH]: 'bg-rose-50 text-rose-700 border-rose-200',
};

const categoryStyles = {
  [Category.WORK]: { icon: '💼', bg: 'bg-blue-50 text-blue-700' },
  [Category.PERSONAL]: { icon: '🏠', bg: 'bg-purple-50 text-purple-700' },
  [Category.SHOPPING]: { icon: '🛒', bg: 'bg-orange-50 text-orange-700' },
  [Category.HEALTH]: { icon: '🧘', bg: 'bg-emerald-50 text-emerald-700' },
  [Category.OTHER]: { icon: '✨', bg: 'bg-slate-50 text-slate-700' },
};

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete }) => {
  const categoryStyle = categoryStyles[todo.category];

  return (
    <div className={`group flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${
      todo.completed 
        ? 'bg-slate-50/50 border-slate-100 opacity-60' 
        : 'bg-white border-slate-200/60 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/5'
    }`}>
      <div className="flex items-center space-x-4 flex-1 min-w-0">
        <button
          onClick={() => onToggle(todo.id)}
          className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
            todo.completed 
              ? 'bg-emerald-500 border-emerald-500 scale-95' 
              : 'border-slate-300 hover:border-indigo-500'
          }`}
        >
          {todo.completed && (
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>
        
        <div className="flex flex-col min-w-0 flex-1">
          <span className={`text-base font-semibold truncate transition-all duration-300 ${
            todo.completed ? 'line-through text-slate-400' : 'text-slate-800'
          }`}>
            {todo.text}
          </span>
          <div className="flex items-center space-x-2 mt-1.5">
            <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold flex items-center gap-1 ${categoryStyle.bg}`}>
              <span>{categoryStyle.icon}</span>
              <span className="uppercase tracking-wider">{todo.category}</span>
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded-md border font-bold uppercase tracking-wider ${priorityColors[todo.priority]}`}>
              {todo.priority}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={() => onDelete(todo.id)}
        className="shrink-0 p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
        aria-label="Delete task"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
};

export default TodoItem;
