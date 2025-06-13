"use client"
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Dashboard = () => {
  const [habit, setHabit] = useState('');
  const [habitsList, setHabitsList] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [contributions, setContributions] = useState({});
  const [calendarData, setCalendarData] = useState([]);
  const [editingHabit, setEditingHabit] = useState(null);
  const [editHabitName, setEditHabitName] = useState('');

  // Generate calendar data (last 6 months, updated dynamically)
  const generateCalendar = () => {
    const months = [];
    const now = new Date();

    for (let m = 5; m >= 0; m--) {
      const month = new Date(now.getFullYear(), now.getMonth() - m, 1);
      const monthName = month.toLocaleString('default', { month: 'short' });
      const year = month.getFullYear();
      const daysInMonth = new Date(year, month.getMonth() + 1, 0).getDate();
      const weeks = [];
      let week = [];

      // Fill in empty days for the first week
      const firstDay = new Date(year, month.getMonth(), 1).getDay();
      for (let i = 0; i < firstDay; i++) {
        week.push(null);
      }

      // Add all days of the month
      for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(year, month.getMonth(), d);
        week.push(date);

        if (week.length === 7) {
          weeks.push(week);
          week = [];
        }
      }

      // Fill remaining days of the last week
      if (week.length > 0) {
        while (week.length < 7) {
          week.push(null);
        }
        weeks.push(week);
      }

      months.push({
        name: monthName,
        year: year,
        weeks: weeks
      });
    }

    return months;
  };

  // Update calendar data on component mount and every day
  useEffect(() => {
    setCalendarData(generateCalendar());

    // Refresh calendar every 24 hours (optional)
    const interval = setInterval(() => {
      setCalendarData(generateCalendar());
    }, 86400000); // 24 hours in ms

    return () => clearInterval(interval);
  }, []);

  // Load saved habits & contributions from localStorage
  useEffect(() => {
    const savedHabits = localStorage.getItem('habitsList');
    const savedContributions = localStorage.getItem('habitContributions');

    if (savedHabits) setHabitsList(JSON.parse(savedHabits));
    if (savedContributions) setContributions(JSON.parse(savedContributions));
  }, []);

  // Save habits & contributions to localStorage when they change
  useEffect(() => {
    localStorage.setItem('habitsList', JSON.stringify(habitsList));
    localStorage.setItem('habitContributions', JSON.stringify(contributions));
  }, [habitsList, contributions]);

  const handleAddHabit = () => {
    if (habit.trim() !== '') {
      setHabitsList([...habitsList, habit]);
      setHabit('');
    }
  };

  const toggleHabitCompletion = (date) => {
    if (!selectedHabit || !date) return;

    const dateStr = date.toISOString().split('T')[0];
    const habitContributions = { ...contributions[selectedHabit] || {} };

    if (habitContributions[dateStr]) {
      delete habitContributions[dateStr];
    } else {
      habitContributions[dateStr] = true;
    }

    setContributions({
      ...contributions,
      [selectedHabit]: habitContributions
    });
  };

  const getContributionLevel = (date, habitName) => {
    if (!date || !habitName || !contributions[habitName]) return 0;
    const dateStr = date.toISOString().split('T')[0];
    return contributions[habitName][dateStr] ? 4 : 0;
  };

  const deleteHabit = (habitName) => {
    let c = confirm("Are you sure you want to delete this habit?")
    if (c) {
      toast('Habit deleted successfully', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setHabitsList(habitsList.filter((item) => item !== habitName));
      setContributions((prev) => {
        const newContributions = { ...prev };
        delete newContributions[habitName];
        return newContributions;
      });

      if (selectedHabit === habitName) setSelectedHabit(null);
      setActiveDropdown(null);
    };
  }
  const startEditingHabit = (habitName) => {
    setEditingHabit(habitName);
    setEditHabitName(habitName);
  };

  const saveEditedHabit = () => {
    if (editHabitName.trim() === '') return;

    // Update habits list
    const updatedHabits = habitsList.map(habit =>
      habit === editingHabit ? editHabitName : habit
    );
    setHabitsList(updatedHabits);

    // Update contributions if the name changed
    if (editingHabit !== editHabitName) {
      setContributions(prev => {
        const newContributions = { ...prev };
        newContributions[editHabitName] = newContributions[editingHabit] || {};
        delete newContributions[editingHabit];
        return newContributions;
      });
    }

    // Reset editing state
    setEditingHabit(null);
    setEditHabitName('');
  };

  const cancelEditing = () => {
    setEditingHabit(null);
    setEditHabitName('');
  };

  return (
    <>
    <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className='min-h-[70vh] flex flex-col items-center'>
        <h2 className='text-xl font-medium text-gray-700 mt-3'>Add your habits and track progress</h2>
        <div className='flex justify-center items-center mt-8 w-[80%] gap-3.5'>
          <input
            className='ml-2 border-2 rounded-4xl border-green-500 w-[50%] p-2'
            type="text"
            placeholder='Enter Habit'
            value={habit}
            onChange={(e) => setHabit(e.target.value)}
          />
          <button
            onClick={handleAddHabit}
            className="bg-green-600 cursor-pointer text-white h-12 px-4 rounded-4xl hover:bg-green-700 transition duration-300 font-medium"
          >
            Add Habit
          </button>
        </div>

        <div className='mt-10 w-[80%]'>
          <h3 className='text-lg font-medium mb-4'>Your Habits</h3>
          {habitsList.length === 0 ? (
            <p className='text-gray-500'>No habits added yet.</p>
          ) : (
            <ul className='space-y-3'>
              {habitsList.map((habitItem, index) => (
                <li key={index} className='flex justify-between items-center bg-gray-100 p-3 rounded-xl'>
                  {editingHabit === habitItem ? (
                    <div className='flex items-center gap-2 w-full'>
                      <input
                        type="text"
                        value={editHabitName}
                        onChange={(e) => setEditHabitName(e.target.value)}
                        className='border-2 rounded p-1 flex-grow'
                      />
                      <button
                        onClick={saveEditedHabit}
                        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className='flex-grow'>{habitItem}</span>
                      <div className="relative inline-block">
                        <button
                          onClick={() => {
                            setActiveDropdown(activeDropdown === index ? null : index);
                            setSelectedHabit(habitItem);
                          }}
                        >
                          <svg className="h-2 ms-3 cursor-pointer w-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                          </svg>
                        </button>
                        <div
                          id="dropdown"
                          className={`z-10 ${activeDropdown === index ? "" : "hidden"} absolute right-0 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow-lg w-[800px] p-4`}
                        >
                          <h4 className='font-medium mb-4'>Track your progress for: {habitItem}</h4>
                          <div className="flex space-x-4 overflow-x-auto p-2">
                            {calendarData.map((month, monthIdx) => (
                              <div key={monthIdx} className="flex flex-col items-center">
                                <div className="text-sm font-medium mb-1">
                                  {month.name} {month.year}
                                </div>
                                <div className="flex flex-col space-y-1">
                                  {month.weeks.map((week, weekIdx) => (
                                    <div key={weekIdx} className="flex space-x-1">
                                      {week.map((day, dayIdx) => {
                                        const level = getContributionLevel(day, habitItem);
                                        const colors = [
                                          'bg-gray-100', // Level 0 - no activity
                                          'bg-green-100', // Level 1
                                          'bg-green-300', // Level 2
                                          'bg-green-500', // Level 3
                                          'bg-green-700'  // Level 4
                                        ];

                                        return (
                                          <div
                                            key={dayIdx}
                                            className={`w-4 h-4 rounded-sm ${colors[level]} ${day ? 'cursor-pointer hover:opacity-80' : ''}`}
                                            onClick={() => toggleHabitCompletion(day)}
                                            title={day ? day.toLocaleDateString() : ''}
                                          />
                                        );
                                      })}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className='flex space-x-4 ml-4'>
                        <button
                          onClick={() => startEditingHabit(habitItem)}
                          className="text-blue-500 hover:text-blue-700"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path fill="currentColor" d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => deleteHabit(habitItem)}
                          className="text-red-500 hover:text-red-700"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                            <path fill="currentColor" d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                          </svg>
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;