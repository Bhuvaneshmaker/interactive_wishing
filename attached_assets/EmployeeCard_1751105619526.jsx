import React from 'react';
import { Heart } from 'lucide-react';

const EmployeeCard = ({ employee, calculateAge, getYearsOfService, formatDate, type = 'birthday' }) => {
  const isBirthday = type === 'birthday';
  
  return (
    <div className={`bg-gradient-to-r ${isBirthday ? 'from-pink-50 to-purple-50' : 'from-green-50 to-blue-50'} rounded-lg p-4 mb-3`}>
      <h5 className={`font-bold text-lg ${isBirthday ? 'text-purple-800' : 'text-blue-800'}`}>
        {employee.name}
      </h5>
      
      {isBirthday ? (
        <>
          <p className="text-sm text-gray-600">🎂 Age: {calculateAge(employee.birthday)} years</p>
          <p className="text-sm text-gray-600">
            ⭐ Joined: {formatDate(employee.joinDate)} ({getYearsOfService(employee.joinDate)} years)
          </p>
        </>
      ) : (
        <>
          <p className="text-sm text-gray-600">
            ⭐ Joined: {formatDate(employee.joinDate)} ({getYearsOfService(employee.joinDate)} years)
          </p>
          <p className="text-sm text-gray-600">🎂 Age: {calculateAge(employee.birthday)} years</p>
        </>
      )}
      
      <div className={`mt-3 p-3 bg-white rounded border-l-4 ${isBirthday ? 'border-pink-500' : 'border-green-500'}`}>
        <p className={`text-sm font-medium ${isBirthday ? 'text-pink-700' : 'text-green-700'}`}>
          <Heart className="inline w-4 h-4 mr-1" />
          {isBirthday 
            ? "Happy Birthday! May your special day be filled with happiness and joy!"
            : "Happy Work Anniversary! Thank you for being an essential part of our journey!"
          }
        </p>
      </div>
    </div>
  );
};

export default EmployeeCard;