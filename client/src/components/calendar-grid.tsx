import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CalendarGridProps {
  currentMonth: Date;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  setCurrentMonth: (date: Date) => void;
  hasBirthdayOnDate: (day: number) => boolean;
  isJoinDate: (day: number) => boolean;
}

export default function CalendarGrid({
  currentMonth,
  selectedDate,
  setSelectedDate,
  setCurrentMonth,
  hasBirthdayOnDate,
  isJoinDate
}: CalendarGridProps) {
  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const changeMonth = (offset: number) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + offset);
    setCurrentMonth(newMonth);
  };

  const renderCalendar = () => {
    const days = [];
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected =
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === currentMonth.getMonth() &&
        selectedDate.getFullYear() === currentMonth.getFullYear();

      const hasBday = hasBirthdayOnDate(day);
      const hasJoin = isJoinDate(day);

      days.push(
        <div
          key={day}
          className={`
            calendar-day flex flex-col items-center justify-center cursor-pointer rounded-lg border-2 relative transition-all duration-200 p-2
            ${isSelected 
              ? 'bg-purple-600 text-white border-purple-600' 
              : 'bg-white hover:bg-purple-50 border-gray-200 hover:border-purple-300'
            }
            ${hasBday ? 'ring-2 ring-pink-400' : ''}
            ${hasJoin ? 'ring-2 ring-green-400' : ''}
          `}
          onClick={() =>
            setSelectedDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))
          }
        >
          <span className="text-sm sm:text-base font-medium">{day}</span>
          <div className="flex gap-1 absolute -bottom-1">
            {hasBday && <div className="text-xs sm:text-sm">🎂</div>}
            {hasJoin && <div className="text-xs sm:text-sm">⭐</div>}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <Button 
          variant="default"
          onClick={() => changeMonth(-1)}
          className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 text-center">
          {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h3>
        <Button 
          variant="default"
          onClick={() => changeMonth(1)}
          className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      <div className="calendar-grid mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="h-8 sm:h-10 flex items-center justify-center text-xs sm:text-sm font-semibold text-gray-600 bg-gray-100 rounded">
            {day}
          </div>
        ))}
      </div>

      <div className="calendar-grid">
        {renderCalendar()}
      </div>

      <div className="mt-4 flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 text-xs sm:text-sm">
        <div className="flex items-center gap-2 justify-center">
          <div className="text-lg ring-2 ring-pink-400 rounded">🎂</div>
          <span className="text-gray-600">Birthday</span>
        </div>
        <div className="flex items-center gap-2 justify-center">
          <div className="text-lg ring-2 ring-green-400 rounded">⭐</div>
          <span className="text-gray-600">Work Anniversary</span>
        </div>
      </div>
    </div>
  );
}
