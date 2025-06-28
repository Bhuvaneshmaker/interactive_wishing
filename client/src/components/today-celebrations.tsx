import { Star, Heart } from 'lucide-react';
import type { Employee } from '@shared/schema';

interface TodaysCelebrationsProps {
  todaysBirthdays: Employee[];
  todayJoin: Employee[];
  calculateAge: (birthday: string) => number;
  getYearsOfService: (joinDate: string) => number;
  formatDate: (dateStr: string) => string;
}

export default function TodaysCelebrations({
  todaysBirthdays,
  todayJoin,
  calculateAge,
  getYearsOfService,
  formatDate
}: TodaysCelebrationsProps) {
  if (todaysBirthdays.length === 0 && todayJoin.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Today's Birthdays */}
      {todaysBirthdays.length > 0 && (
        <div className="birthday-gradient text-white rounded-xl shadow-lg p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 flex items-center justify-center gap-2 flex-wrap">
            <Star className="text-yellow-300 animate-spin" />
            <span>🎉 Today's Birthday Celebrations! 🎉</span>
            <Heart className="text-red-300 animate-bounce-slow" />
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {todaysBirthdays.map((emp) => (
              <div key={emp.id} className="celebration-card">
                <h4 className="font-bold text-lg sm:text-xl text-white">{emp.name}</h4>
                <p className="text-pink-200">🎂 Turning {calculateAge(emp.birthday)} years old!</p>
                <div className="mt-2 p-2 bg-white bg-opacity-10 rounded">
                  <p className="text-xs sm:text-sm text-white">
                    🎊 "Wishing you a fantastic birthday filled with joy, laughter, and wonderful memories!"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Today's Work Anniversaries */}
      {todayJoin.length > 0 && (
        <div className="anniversary-gradient text-white rounded-xl shadow-lg p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 flex items-center justify-center gap-2 flex-wrap">
            <Star className="text-yellow-300 animate-spin" />
            <span>🎉 Work Anniversary Celebrations! 🎉</span>
            <Heart className="text-red-300 animate-bounce-slow" />
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {todayJoin.map((emp) => (
              <div key={emp.id} className="bg-white bg-opacity-20 rounded-lg p-4">
                <h4 className="font-bold text-lg sm:text-xl text-white">{emp.name}</h4>
                <p className="text-green-200">🎉 Celebrating {getYearsOfService(emp.joinDate)} years!</p>
                <div className="mt-2 p-2 bg-white bg-opacity-10 rounded">
                  <p className="text-xs sm:text-sm text-white">
                    🎊 "Congratulations on {getYearsOfService(emp.joinDate)} amazing years with us since {formatDate(emp.joinDate)}!"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
