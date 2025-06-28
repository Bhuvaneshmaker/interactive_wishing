import React from 'react';
import { Calendar } from 'lucide-react';
import EmployeeCard from './EmployeeCard';

const DateDetails = ({ 
  selectedDate, 
  birthdayEmployees, 
  joinEmployee, 
  calculateAge, 
  getYearsOfService, 
  formatDate 
}) => {
  const formattedDate = selectedDate.toLocaleDateString('en-US', {
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric'
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Birthdays */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
          <Calendar className="text-blue-600" />
          {formattedDate}
        </h3>

        {birthdayEmployees.length > 0 ? (
          <div>
            <h4 className="text-lg font-semibold text-pink-600 mb-3">
              🎉 Birthday Celebrants ({birthdayEmployees.length})
            </h4>
            {birthdayEmployees.map((emp, index) => (
              <EmployeeCard
                key={index}
                employee={emp}
                calculateAge={calculateAge}
                getYearsOfService={getYearsOfService}
                formatDate={formatDate}
                type="birthday"
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-6xl mb-3">📅</div>
            <p className="text-gray-500">No birthdays on this date</p>
          </div>
        )}
      </div>

      {/* Work Anniversaries */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
          <Calendar className="text-blue-600" />
          {formattedDate}
        </h3>

        {joinEmployee.length > 0 ? (
          <div>
            <h4 className="text-lg font-semibold text-green-600 mb-3">
              🎉 Work Anniversary ({joinEmployee.length})
            </h4>
            {joinEmployee.map((emp, index) => (
              <EmployeeCard
                key={index}
                employee={emp}
                calculateAge={calculateAge}
                getYearsOfService={getYearsOfService}
                formatDate={formatDate}
                type="anniversary"
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-6xl mb-3">📅</div>
            <p className="text-gray-500">No work anniversaries on this date</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DateDetails;