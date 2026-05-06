'use client';

import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Calendar, 
  AlertCircle,
  Plus,
  ArrowLeft,
  User
} from 'lucide-react';
import Link from 'next/link';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  category: 'admission' | 'daily' | 'weekly' | 'orientation';
}

const INITIAL_TASKS: Task[] = [
  // Admission
  { id: '1', text: 'Conduct initial intake interview', completed: false, category: 'admission' },
  { id: '2', text: 'Review house rules and policies', completed: false, category: 'admission' },
  { id: '3', text: 'Assign bed and locker/lockbox', completed: false, category: 'admission' },
  { id: '4', text: 'Collect emergency contact information', completed: false, category: 'admission' },
  { id: '5', text: 'Issue house keys/access codes', completed: false, category: 'admission' },
  
  // Daily
  { id: '6', text: 'Morning house check (beds made, common areas clean)', completed: false, category: 'daily' },
  { id: '7', text: 'Monitor medication administration (if applicable)', completed: false, category: 'daily' },
  { id: '8', text: 'Evening curfew check', completed: false, category: 'daily' },
  { id: '9', text: 'Update daily log book', completed: false, category: 'daily' },
  
  // Weekly
  { id: '10', text: 'Conduct weekly house meeting', completed: false, category: 'weekly' },
  { id: '11', text: 'Perform random room inspections', completed: false, category: 'weekly' },
  { id: '12', text: 'Update chore assignments for the next week', completed: false, category: 'weekly' },
  { id: '13', text: 'Inventory house supplies (cleaning, hygiene)', completed: false, category: 'weekly' },

  // Orientation
  { id: '14', text: 'Tour of facility and local area', completed: false, category: 'orientation' },
  { id: '15', text: 'Introduction to other residents', completed: false, category: 'orientation' },
  { id: '16', text: 'Explanation of chore rotation system', completed: false, category: 'orientation' },
];

export default function ChecklistPage() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [activeCategory, setActiveCategory] = useState<Task['category']>('admission');

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const filteredTasks = tasks.filter(task => task.category === activeCategory);
  const completionPercentage = Math.round(
    (tasks.filter(t => t.completed).length / tasks.length) * 100
  );

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <Link 
              href="/admin"
              className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 mb-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white flex items-center">
              <ClipboardCheck className="w-8 h-8 mr-3 text-blue-600" />
              House Manager Checklists
            </h1>
          </div>
          
          <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center gap-4">
            <div className="relative w-12 h-12">
              <svg className="w-12 h-12 transform -rotate-90">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  className="text-zinc-100 dark:text-zinc-800"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  strokeDasharray={125.6}
                  strokeDashoffset={125.6 * (1 - completionPercentage / 100)}
                  className="text-blue-600 transition-all duration-500 ease-in-out"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold dark:text-white">
                {completionPercentage}%
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-900 dark:text-white">Overall Progress</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{tasks.filter(t => t.completed).length} of {tasks.length} tasks completed</p>
            </div>
          </div>
        </div>

        {/* Categories Tab Navigation */}
        <div className="flex overflow-x-auto pb-4 mb-6 gap-2 scrollbar-hide">
          <CategoryButton 
            active={activeCategory === 'admission'} 
            onClick={() => setActiveCategory('admission')}
            icon={<Plus className="w-4 h-4" />}
            label="Admission"
            count={tasks.filter(t => t.category === 'admission').length}
          />
          <CategoryButton 
            active={activeCategory === 'orientation'} 
            onClick={() => setActiveCategory('orientation')}
            icon={<User className="w-4 h-4" />}
            label="Orientation"
            count={tasks.filter(t => t.category === 'orientation').length}
          />
          <CategoryButton 
            active={activeCategory === 'daily'} 
            onClick={() => setActiveCategory('daily')}
            icon={<Clock className="w-4 h-4" />}
            label="Daily Tasks"
            count={tasks.filter(t => t.category === 'daily').length}
          />
          <CategoryButton 
            active={activeCategory === 'weekly'} 
            onClick={() => setActiveCategory('weekly')}
            icon={<Calendar className="w-4 h-4" />}
            label="Weekly Tasks"
            count={tasks.filter(t => t.category === 'weekly').length}
          />
        </div>

        {/* Tasks List */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden">
          <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50 flex justify-between items-center">
            <h2 className="font-bold text-zinc-900 dark:text-white capitalize">
              {activeCategory} Checklist
            </h2>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
              {filteredTasks.filter(t => t.completed).length} / {filteredTasks.length} Done
            </span>
          </div>
          
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {filteredTasks.length > 0 ? (
              filteredTasks.map(task => (
                <button
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className="w-full flex items-center p-6 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors text-left group"
                >
                  <div className={`flex-shrink-0 mr-4 transition-transform group-active:scale-90 ${task.completed ? 'text-green-500' : 'text-zinc-300 dark:text-zinc-600'}`}>
                    {task.completed ? (
                      <CheckCircle2 className="w-7 h-7" />
                    ) : (
                      <Circle className="w-7 h-7" />
                    )}
                  </div>
                  <span className={`text-lg font-medium transition-colors ${task.completed ? 'text-zinc-400 dark:text-zinc-500 line-through' : 'text-zinc-700 dark:text-zinc-200'}`}>
                    {task.text}
                  </span>
                </button>
              ))
            ) : (
              <div className="p-12 text-center">
                <AlertCircle className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                <p className="text-zinc-500 dark:text-zinc-400">No tasks found in this category.</p>
              </div>
            )}
          </div>
          
          <div className="p-6 bg-zinc-50/50 dark:bg-zinc-800/50 border-t border-zinc-100 dark:border-zinc-800">
            <button className="flex items-center text-blue-600 dark:text-blue-400 font-semibold hover:underline">
              <Plus className="w-5 h-5 mr-2" />
              Add Custom Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CategoryButton({ active, onClick, icon, label, count }: { 
  active: boolean; 
  onClick: () => void; 
  icon: React.ReactNode; 
  label: string;
  count: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center px-5 py-3 rounded-2xl font-semibold transition-all whitespace-nowrap ${
        active 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-2 ring-blue-600 ring-offset-2 dark:ring-offset-zinc-950' 
          : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:border-blue-300 dark:hover:border-blue-800'
      }`}
    >
      <span className="mr-2">{icon}</span>
      {label}
      <span className={`ml-3 text-xs px-2 py-0.5 rounded-full ${active ? 'bg-blue-500 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'}`}>
        {count}
      </span>
    </button>
  );
}
