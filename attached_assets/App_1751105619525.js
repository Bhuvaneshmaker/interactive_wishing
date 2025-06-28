import React, { useState } from 'react';
import { Gift, Cake } from 'lucide-react';
import { useEmployees } from './hooks/useEmployees';
import { useDateFilters } from './hooks/useDateFilters';
import TodaysCelebrations from './components/TodaysCelebrations';
import Calendar from './components/Calendar';
import DateDetails from './components/DateDetails';
import Stats from './components/Stats';
import EmployeeForm from './components/EmployeeForm';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const { employees, loading, addEmployee } = useEmployees();
  const [isAddingEmployee, setIsAddingEmployee] = useState(false);
  
  const {
    selectedDate,
    setSelectedDate,
    currentMonth,
    setCurrentMonth,
    todaysBirthdays,
    todayJoin,
    birthdayEmployees,
    joinEmployee,
    calculateAge,
    getYearsOfService,
    formatDate,
    hasBirthdayOnDate,
    isJoinDate
  } = useDateFilters(employees);

  const handleAddEmployee = async (employeeData) => {
    setIsAddingEmployee(true);
    try {
      await addEmployee(employeeData);
    } finally {
      setIsAddingEmployee(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-purple-600 font-medium">Loading to get the Celebraties...</p>
        </div>
      </div>
    );
  }

  return (
   <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 py-8">
  <div className="container mx-auto px-4 space-y-8">

    {/* Header */}
    <div className="text-center">
      <h1 className="text-4xl font-bold text-purple-800 mb-2 flex justify-center items-center gap-3">
        <Gift className="text-pink-600" />
        Birthday & Joinday
        <Cake className="text-pink-600" />
      </h1>
      <p className="text-gray-600">Celebrating every milestone, every year! 🎉</p>
    </div>

    {/* Today's Celebrations */}
    <div className="w-full">
      <TodaysCelebrations
        todaysBirthdays={todaysBirthdays}
        todayJoin={todayJoin}
        calculateAge={calculateAge}
        getYearsOfService={getYearsOfService}
        formatDate={formatDate}
      />
    </div>

    {/* Calendar */}
    <div className="w-full">
      <Calendar
        currentMonth={currentMonth}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        setCurrentMonth={setCurrentMonth}
        hasBirthdayOnDate={hasBirthdayOnDate}
        isJoinDate={isJoinDate}
      />
    </div>


    {/* Date Details */}
    <div className="w-full">
      <DateDetails
        selectedDate={selectedDate}
        birthdayEmployees={birthdayEmployees}
        joinEmployee={joinEmployee}
        calculateAge={calculateAge}
        getYearsOfService={getYearsOfService}
        formatDate={formatDate}
      />
    </div>

        {/* Stats */}
    <div className="w-full">
      <Stats employees={employees} currentMonth={currentMonth} />
    </div>
  
  
    {/* Add Employee Form */}
    <div className="w-full">
      <EmployeeForm 
        onAddEmployee={handleAddEmployee}
        isLoading={isAddingEmployee}
      />
    </div>

  </div>
</div>
  );
}

export default App;
