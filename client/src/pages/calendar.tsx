import { useEmployees } from '@/hooks/use-employees';
import { useDateFilters } from '@/hooks/use-date-filters';
import CalendarGrid from '@/components/calendar-grid';
import { csvExportUtils } from '@/lib/csv-export';
import { Download, Calendar as CalendarIcon, Users, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default function Calendar() {
  const { employees, isLoading } = useEmployees();
  
  const {
    currentMonth,
    setCurrentMonth,
    selectedDate,
    setSelectedDate,
    hasBirthdayOnDate,
    isJoinDate,
    getMonthEvents
  } = useDateFilters(employees);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleExportBirthdays = () => {
    csvExportUtils.exportBirthdayCalendar(employees);
  };

  const handleExportAnniversaries = () => {
    csvExportUtils.exportAnniversaryCalendar(employees);
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
          <p className="text-purple-600 font-medium">Loading calendar...</p>
        </div>
      </div>
    );
  }

  const { monthBirthdays, monthJoins } = getMonthEvents();

  return (
    <div className="page-transition">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Calendar Header */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Calendar View</h1>
              <p className="text-gray-600 text-sm sm:text-base">View all birthdays and work anniversaries</p>
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Download className="w-4 h-4 mr-2" />
                    Export Calendar
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={handleExportAll}>
                    <Users className="w-4 h-4 mr-2" />
                    All Employees ({employees.length})
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExportBirthdays}>
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    Birthday Calendar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExportAnniversaries}>
                    <FileDown className="w-4 h-4 mr-2" />
                    Anniversary Calendar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExportUpcoming}>
                    <Download className="w-4 h-4 mr-2" />
                    Upcoming Events (30 days)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <CalendarGrid
          currentMonth={currentMonth}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          setCurrentMonth={setCurrentMonth}
          hasBirthdayOnDate={hasBirthdayOnDate}
          isJoinDate={isJoinDate}
        />

        {/* Calendar Events List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-pink-600 mb-4">
              🎂 This Month's Birthdays ({monthBirthdays.length})
            </h3>
            <div className="space-y-3">
              {monthBirthdays.length > 0 ? (
                monthBirthdays.map((emp) => (
                  <div key={emp.id} className="flex items-center gap-3 p-3 bg-pink-50 rounded-lg">
                    <div className="employee-avatar">
                      {getInitials(emp.name)}
                    </div>
                    <div>
                      <p className="font-medium">{emp.name}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(emp.birthday).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">🎂</div>
                  <p className="text-gray-500">No birthdays this month</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-green-600 mb-4">
              ⭐ This Month's Anniversaries ({monthJoins.length})
            </h3>
            <div className="space-y-3">
              {monthJoins.length > 0 ? (
                monthJoins.map((emp) => (
                  <div key={emp.id} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="employee-avatar">
                      {getInitials(emp.name)}
                    </div>
                    <div>
                      <p className="font-medium">{emp.name}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(emp.joinDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">⭐</div>
                  <p className="text-gray-500">No anniversaries this month</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
