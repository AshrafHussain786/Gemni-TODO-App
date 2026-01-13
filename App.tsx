
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Todo, Priority, Category } from './types';
import TodoItem from './components/TodoItem';

const categoryIcons: Record<Category, string> = {
  [Category.WORK]: '💼',
  [Category.PERSONAL]: '🏠',
  [Category.SHOPPING]: '🛒',
  [Category.HEALTH]: '🧘',
  [Category.OTHER]: '✨',
};

const priorityLabels: Record<Priority, string> = {
  [Priority.LOW]: 'Low',
  [Priority.MEDIUM]: 'Medium',
  [Priority.HIGH]: 'High',
};

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('zentask-todos');
    return saved ? JSON.parse(saved) : [];
  });
  const [inputValue, setInputValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>(Category.OTHER);
  const [selectedPriority, setSelectedPriority] = useState<Priority>(Priority.MEDIUM);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [categoryFilter, setCategoryFilter] = useState<Category | 'All'>('All');

  useEffect(() => {
    localStorage.setItem('zentask-todos', JSON.stringify(todos));
  }, [todos]);

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    const text = inputValue.trim();
    if (!text) return;

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: text,
      completed: false,
      priority: selectedPriority,
      category: selectedCategory,
      createdAt: Date.now(),
    };

    setTodos(prev => [newTodo, ...prev]);
    setInputValue('');
    
    // Switch view if the new item is in a hidden category
    if (categoryFilter !== 'All' && categoryFilter !== selectedCategory) {
      setCategoryFilter(selectedCategory);
    }
  };

  const handleToggleTodo = useCallback((id: string) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  }, []);

  const handleDeleteTodo = useCallback((id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, []);

  const handleClearCompleted = () => {
    setTodos(prev => prev.filter(todo => !todo.completed));
  };

  const filteredTodos = useMemo(() => {
    return todos
      .filter(todo => {
        if (filter === 'active') return !todo.completed;
        if (filter === 'completed') return todo.completed;
        return true;
      })
      .filter(todo => {
        if (categoryFilter === 'All') return true;
        return todo.category === categoryFilter;
      })
      .sort((a, b) => b.createdAt - a.createdAt);
  }, [todos, filter, categoryFilter]);

  const stats = useMemo(() => ({
    total: todos.length,
    active: todos.filter(t => !t.completed).length,
    completed: todos.filter(t => t.completed).length,
  }), [todos]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center py-12 px-4 md:px-0">
      <div className="w-full max-w-2xl">
        <header className="mb-10 text-center">
          <div className="inline-block p-3 rounded-2xl bg-white shadow-sm mb-4 border border-gray-100">
             <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
             </svg>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-br from-indigo-600 to-violet-700">
              ZenTask
            </span>
          </h1>
          <p className="mt-2 text-slate-500 font-medium">Precision task management.</p>
        </header>

        <section className="bg-white rounded-3xl shadow-xl shadow-indigo-100/30 p-6 mb-8 border border-indigo-50/50">
          <form onSubmit={handleAddTodo}>
            <div className="relative mb-6">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="What needs to be done?"
                className="w-full pl-4 pr-14 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-700 text-lg placeholder-slate-400"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="absolute right-2 top-2 bottom-2 w-12 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center justify-center shadow-lg shadow-indigo-200"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest w-full sm:w-auto mb-1 sm:mb-0 mr-2">Category:</span>
                {Object.values(Category).map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                      selectedCategory === cat 
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' 
                      : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    {categoryIcons[cat]} {cat}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest w-full sm:w-auto mb-1 sm:mb-0 mr-2">Priority:</span>
                {Object.values(Priority).map(prio => (
                  <button
                    key={prio}
                    type="button"
                    onClick={() => setSelectedPriority(prio)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                      selectedPriority === prio 
                      ? 'bg-slate-800 text-white border-slate-800 shadow-md' 
                      : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    {priorityLabels[prio]}
                  </button>
                ))}
              </div>
            </div>
          </form>
          
          <div className="mt-6 flex flex-wrap items-center justify-between text-xs border-t border-slate-50 pt-4">
            <div className="flex gap-3">
              <span className="text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-md">{stats.active} Active</span>
              <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">{stats.completed} Done</span>
            </div>
            {stats.completed > 0 && (
              <button onClick={handleClearCompleted} className="text-rose-500 hover:text-rose-600 font-bold uppercase tracking-widest text-[10px]">
                Clear Completed
              </button>
            )}
          </div>
        </section>

        <section className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 px-1">
          <div className="flex bg-slate-200/50 p-1 rounded-2xl w-full sm:w-auto">
            {(['all', 'active', 'completed'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-1 sm:flex-none px-6 py-2 rounded-xl text-sm font-bold capitalize transition-all ${
                  filter === f ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Show:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as any)}
              className="flex-1 sm:flex-none bg-white border border-slate-200 rounded-2xl px-4 py-2.5 text-sm font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 appearance-none pr-10 relative bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22/%3E%3C/svg%3E')] bg-[length:20px_20px] bg-[right_10px_center] bg-no-repeat"
            >
              <option value="All">All Categories</option>
              {Object.values(Category).map(cat => (
                <option key={cat} value={cat}>{categoryIcons[cat]} {cat}</option>
              ))}
            </select>
          </div>
        </section>

        <main className="space-y-3 min-h-[300px]">
          {filteredTodos.length > 0 ? (
            filteredTodos.map(todo => (
              <TodoItem key={todo.id} todo={todo} onToggle={handleToggleTodo} onDelete={handleDeleteTodo} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-100">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-3xl mb-4 grayscale opacity-50">
                {categoryFilter !== 'All' ? '🔍' : '📭'}
              </div>
              <h3 className="text-lg font-bold text-slate-800">No tasks found</h3>
              <p className="text-slate-400 text-sm max-w-[240px] text-center mt-1 font-medium">
                {categoryFilter !== 'All' 
                  ? `Nothing in the "${categoryFilter}" folder.`
                  : 'Your dashboard is clear.'
                }
              </p>
              {categoryFilter !== 'All' && (
                <button onClick={() => setCategoryFilter('All')} className="mt-6 text-indigo-600 font-bold text-xs uppercase tracking-widest hover:underline">
                  View All
                </button>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
