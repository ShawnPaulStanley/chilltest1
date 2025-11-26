import React, { useState } from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell, LineChart, Line } from 'recharts';
import { BarChart2, TrendingUp } from 'lucide-react';
import { DailyStats } from '../types';

interface StatsProps {
  data: DailyStats[];
}

export const Stats: React.FC<StatsProps> = ({ data }) => {
  const [view, setView] = useState<'bar' | 'line'>('bar');

  // Mock data if empty
  const chartData = data.length > 0 ? data : [
    { date: 'Mon', focusMinutes: 45, tasksCompleted: 2 },
    { date: 'Tue', focusMinutes: 120, tasksCompleted: 5 },
    { date: 'Wed', focusMinutes: 90, tasksCompleted: 3 },
    { date: 'Thu', focusMinutes: 60, tasksCompleted: 4 },
    { date: 'Fri', focusMinutes: 150, tasksCompleted: 8 },
    { date: 'Sat', focusMinutes: 200, tasksCompleted: 10 },
    { date: 'Sun', focusMinutes: 80, tasksCompleted: 3 },
  ];

  return (
    <div className="bg-white/80 dark:bg-pastel-darkCard/80 backdrop-blur-sm p-6 rounded-3xl shadow-lg h-64 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-hand text-2xl text-pastel-text dark:text-pastel-darkText">
          {view === 'bar' ? 'Weekly Focus' : 'Focus Trend'}
        </h3>
        <div className="flex bg-pastel-lavender/30 dark:bg-black/20 rounded-xl p-1 gap-1">
          <button 
            onClick={() => setView('bar')}
            className={`p-1.5 rounded-lg transition-all ${view === 'bar' ? 'bg-white dark:bg-gray-700 shadow-sm text-pastel-peach' : 'text-gray-400 hover:text-gray-600'}`}
            title="Bar Chart"
          >
            <BarChart2 size={16} />
          </button>
          <button 
            onClick={() => setView('line')}
            className={`p-1.5 rounded-lg transition-all ${view === 'line' ? 'bg-white dark:bg-gray-700 shadow-sm text-pastel-peach' : 'text-gray-400 hover:text-gray-600'}`}
            title="Line Chart"
          >
            <TrendingUp size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {view === 'bar' ? (
            <BarChart data={chartData}>
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9CA3AF', fontFamily: 'Quicksand', fontSize: 12 }} 
                interval={0}
              />
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="focusMinutes" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={['#E6E6FA', '#FFDAB9', '#E0F2F1', '#E0F7FA'][index % 4]} />
                ))}
              </Bar>
            </BarChart>
          ) : (
            <LineChart data={chartData}>
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9CA3AF', fontFamily: 'Quicksand', fontSize: 12 }} 
                padding={{ left: 10, right: 10 }}
                interval={0}
              />
              <Tooltip 
                cursor={{ stroke: '#FFDAB9', strokeWidth: 2 }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Line 
                type="monotone" 
                dataKey="focusMinutes" 
                stroke="#FFDAB9" 
                strokeWidth={3} 
                dot={{ fill: '#E6E6FA', stroke: '#FFDAB9', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#FFDAB9' }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};