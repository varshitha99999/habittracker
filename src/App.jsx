import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Check, Flame, Trophy } from 'lucide-react';
import { getToday, calculateStreak, getLastNDays, formatDateLabel } from './utils';

function App() {
  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem('habits');
    return saved ? JSON.parse(saved) : [];
  });
  const [newHabit, setNewHabit] = useState('');

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  const addHabit = (e) => {
    e.preventDefault();
    if (!newHabit.trim()) return;
    
    setHabits([
      ...habits,
      {
        id: crypto.randomUUID(),
        name: newHabit,
        completedDates: []
      }
    ]);
    setNewHabit('');
  };

  const deleteHabit = (id) => {
    setHabits(habits.filter(h => h.id !== id));
  };

  const toggleHabitDate = (id, date) => {
    setHabits(habits.map(habit => {
      if (habit.id === id) {
        const isCompleted = habit.completedDates.includes(date);
        let newDates;
        if (isCompleted) {
          newDates = habit.completedDates.filter(d => d !== date);
        } else {
          newDates = [...habit.completedDates, date];
        }
        return { ...habit, completedDates: newDates };
      }
      return habit;
    }));
  };

  const dates = getLastNDays(7);
  const today = getToday();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Habit Tracker</h1>
            <p className="text-gray-500 mt-1">Consistency is key</p>
          </div>
          
          <form onSubmit={addHabit} className="flex gap-2">
            <input
              type="text"
              value={newHabit}
              onChange={(e) => setNewHabit(e.target.value)}
              placeholder="New habit..."
              className="w-64 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 font-medium"
            >
              <Plus className="w-5 h-5" />
              Add
            </button>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="p-4 font-semibold text-gray-600 w-1/4 min-w-[200px]">Habit</th>
                  {dates.map(date => {
                    const isToday = date === today;
                    return (
                      <th key={date} className={`p-4 font-semibold text-center min-w-[80px] ${isToday ? 'text-indigo-600 bg-indigo-50' : 'text-gray-600'}`}>
                        <div className="text-xs uppercase tracking-wider mb-1">{formatDateLabel(date).split(' ')[0]}</div>
                        <div className="text-lg">{formatDateLabel(date).split(' ')[1]}</div>
                      </th>
                    );
                  })}
                  <th className="p-4 font-semibold text-gray-600 text-center w-24">Streak</th>
                  <th className="p-4 font-semibold text-gray-600 text-center w-20"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {habits.length === 0 ? (
                  <tr>
                    <td colSpan={dates.length + 3} className="p-12 text-center text-gray-500">
                      No habits yet. Add one above to get started!
                    </td>
                  </tr>
                ) : (
                  habits.map(habit => {
                    const streak = calculateStreak(habit.completedDates);
                    return (
                      <tr key={habit.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4 font-medium text-gray-900">
                          {habit.name}
                        </td>
                        {dates.map(date => {
                          const isCompleted = habit.completedDates.includes(date);
                          const isToday = date === today;
                          return (
                            <td key={date} className={`p-2 text-center ${isToday ? 'bg-indigo-50/30' : ''}`}>
                              <button
                                onClick={() => toggleHabitDate(habit.id, date)}
                                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 mx-auto ${
                                  isCompleted
                                    ? 'bg-green-500 text-white shadow-sm hover:bg-green-600 scale-100'
                                    : 'bg-gray-100 text-gray-300 hover:bg-gray-200 scale-95 hover:scale-100'
                                }`}
                              >
                                {isCompleted && <Check className="w-6 h-6" />}
                              </button>
                            </td>
                          );
                        })}
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-1 font-medium text-gray-700">
                            <Flame className={`w-5 h-5 ${streak > 0 ? 'text-orange-500 fill-orange-500' : 'text-gray-300'}`} />
                            <span>{streak}</span>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => deleteHabit(habit.id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete habit"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
