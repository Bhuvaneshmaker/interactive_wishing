import { useEmployees } from '@/hooks/use-employees';
import { useDateFilters } from '@/hooks/use-date-filters';
import TodaysCelebrations from '@/components/today-celebrations';
import CalendarGrid from '@/components/calendar-grid';
import EmployeeCard from '@/components/employee-card';
import StatsCard from '@/components/stats-card';
import EmployeeForm from '@/components/employee-form';
import { csvExportUtils } from '@/lib/csv-export';
import { Gift, Cake, Calendar, Download, Users, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default function Dashboard() {
  const { employees, isLoading, addEmployee, isAddingEmployee } = useEmployees();
  
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

  const handleExportTodaysCelebrations = () => {
    const todaysEvents = [...todaysBirthdays, ...todayJoin];
    if (todaysEvents.length > 0) {
      csvExportUtils.exportEmployeesToCSV(todaysEvents, {
        filename: `todays-celebrations-${new Date().toISOString().split('T')[0]}`
      });
    }
  };

  const handleExportUpcoming = () => {
    csvExportUtils.exportUpcomingEvents(employees);
  };

  const handleExportAll = () => {
    csvExportUtils.exportEmployeesToCSV(employees, {
      filename: `all-employees-${new Date().toISOString().split('T')[0]}`
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-purple-600 font-medium">Loading celebrations...</p>
        </div>
      </div>
    );
  }

  const formattedDate = selectedDate.toLocaleDateString('en-US', {
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric'
  });

  return (
    <div className="page-transition">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl font-bold text-purple-800 mb-2 flex justify-center sm:justify-start items-center gap-3 flex-wrap">
                <Gift className="text-pink-600" />
                <span>Birthday & Work Anniversary</span>
                <Cake className="text-pink-600" />
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">Celebrating every milestone, every year! 🎉</p>
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Quick Export</span>
                    <span className="sm:hidden">Export</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {(todaysBirthdays.length > 0 || todayJoin.length > 0) && (
                    <DropdownMenuItem onClick={handleExportTodaysCelebrations}>
                      <Gift className="w-4 h-4 mr-2" />
                      Today's Celebrations ({todaysBirthdays.length + todayJoin.length})
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleExportUpcoming}>
                    <Calendar className="w-4 h-4 mr-2" />
                    Upcoming Events (30 days)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExportAll}>
                    <Users className="w-4 h-4 mr-2" />
                    All Employees ({employees.length})
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Today's Celebrations */}
        <TodaysCelebrations
          todaysBirthdays={todaysBirthdays}
          todayJoin={todayJoin}
          calculateAge={calculateAge}
          getYearsOfService={getYearsOfService}
          formatDate={formatDate}
        />

        {/* Calendar and Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendar Section */}
          <div className="lg:col-span-3">
            <CalendarGrid
              currentMonth={currentMonth}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              setCurrentMonth={setCurrentMonth}
              hasBirthdayOnDate={hasBirthdayOnDate}
              isJoinDate={isJoinDate}
            />
          </div>

          {/* Stats Sidebar */}
          <div className="lg:col-span-1">
            <StatsCard employees={employees} currentMonth={currentMonth} />
          </div>
        </div>

        {/* Date Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Selected Date Birthdays */}
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 flex items-center gap-2">
              <Calendar className="text-blue-600" />
              <span className="text-sm sm:text-base">{formattedDate}</span>
            </h3>

            {birthdayEmployees.length > 0 ? (
              <div>
                <h4 className="text-base sm:text-lg font-semibold text-pink-600 mb-3">
                  🎉 Birthday Celebrants ({birthdayEmployees.length})
                </h4>
                {birthdayEmployees.map((emp) => (
                  <EmployeeCard
                    key={emp.id}
                    employee={emp}
                    calculateAge={calculateAge}
                    getYearsOfService={getYearsOfService}
                    formatDate={formatDate}
                    type="birthday"
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-6 sm:py-8">
                <div className="text-4xl sm:text-6xl mb-3">📅</div>
                <p className="text-gray-500 text-sm sm:text-base">No birthdays on this date</p>
              </div>
            )}
          </div>

          {/* Selected Date Anniversaries */}
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 flex items-center gap-2">
              <Calendar className="text-blue-600" />
              <span className="text-sm sm:text-base">{formattedDate}</span>
            </h3>

            {joinEmployee.length > 0 ? (
              <div>
                <h4 className="text-base sm:text-lg font-semibold text-green-600 mb-3">
                  🎉 Work Anniversary ({joinEmployee.length})
                </h4>
                {joinEmployee.map((emp) => (
                  <EmployeeCard
                    key={emp.id}
                    employee={emp}
                    calculateAge={calculateAge}
                    getYearsOfService={getYearsOfService}
                    formatDate={formatDate}
                    type="anniversary"
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-6 sm:py-8">
                <div className="text-4xl sm:text-6xl mb-3">📅</div>
                <p className="text-gray-500 text-sm sm:text-base">No work anniversaries on this date</p>
              </div>
            )}
          </div>
        </div>

        {/* Add Employee Form */}
        <EmployeeForm 
          onAddEmployee={addEmployee}
          isLoading={isAddingEmployee}
        />
      </div>
    </div>
  );
}
