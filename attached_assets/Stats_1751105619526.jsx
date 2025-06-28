import React from 'react';

const Stats = ({ employees, currentMonth }) => {
  const thisMonthBirthdays = employees.filter(emp => 
    new Date(emp.birthday).getMonth() === currentMonth.getMonth()
  ).length;

  const thisMonthJoinings = employees.filter(emp => 
    new Date(emp.joinDate).getMonth() === currentMonth.getMonth()
  ).length;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h4 className="text-lg font-semibold mb-4 text-center">📊 Quick Stats</h4>
      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Total Employees</p>
          <p className="text-2xl font-bold text-blue-600">{employees.length}</p>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">This Month's Birthdays</p>
          <p className="text-2xl font-bold text-purple-600">{thisMonthBirthdays}</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">This Month's Anniversaries</p>
          <p className="text-2xl font-bold text-green-600">{thisMonthJoinings}</p>
        </div>
      </div>
    </div>
  );
};

export default Stats;