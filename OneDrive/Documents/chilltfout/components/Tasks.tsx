import React, { useState, useEffect } from 'react';
import { Plus, X, Check } from 'lucide-react';
import { Task } from '../types';

export const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('chillTFout-tasks');
    if (saved) {
      try {
        setTasks(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load tasks");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('chillTFout-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const colors = ['bg-pastel-peach', 'bg-pastel-mint', 'bg-pastel-blue', 'bg-pastel-lavender'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newTask: Task = {
      id: Date.now().toString(),
      text: input,
      completed: false,
      color: randomColor
    };

    setTasks([newTask, ...tasks]);
    setInput('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const removeTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="space-y-4">
      <h2 className="font-hand text-3xl text-pastel-text dark:text-pastel-darkText mb-4">Focus Tasks</h2>
      
      <form onSubmit={addTask} className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a new task..."
          className="w-full bg-white/50 dark:bg-white/10 backdrop-blur-sm border-b-2 border-pastel-lavender px-4 py-3 font-hand text-xl focus:outline-none focus:border-pastel-peach transition-colors placeholder:text-gray-400 dark:text-white"
        />
        <button type="submit" className="absolute right-2 top-2 p-2 text-pastel-text dark:text-gray-300 hover:text-pastel-peach">
          <Plus size={20} />
        </button>
      </form>

      <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-2">
        {tasks.map(task => (
          <div 
            key={task.id}
            className={`
              relative p-4 rounded-lg shadow-sm transform transition-all duration-300 hover:-translate-y-1 group
              ${task.completed ? 'opacity-60 grayscale' : task.color}
              dark:opacity-90
            `}
            style={{ fontFamily: '"Patrick Hand", cursive' }}
          >
            <div className="flex items-start justify-between">
              <span className={`text-xl text-gray-800 ${task.completed ? 'line-through' : ''}`}>
                {task.text}
              </span>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => toggleTask(task.id)}
                  className="p-1 rounded-full hover:bg-white/30 text-gray-700"
                >
                  <Check size={16} />
                </button>
                <button 
                  onClick={() => removeTask(task.id)}
                  className="p-1 rounded-full hover:bg-white/30 text-gray-700"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
            {/* Sticky note tape effect */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-4 bg-white/30 backdrop-blur-sm rotate-1"></div>
          </div>
        ))}
        {tasks.length === 0 && (
          <div className="text-center text-gray-400 font-hand text-xl mt-8">
            No tasks yet. Stay chill.
          </div>
        )}
      </div>
    </div>
  );
};