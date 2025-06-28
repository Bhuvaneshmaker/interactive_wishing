import { useState, useMemo } from 'react';
import type { Employee } from '@shared/schema';

export const useDateFilters = (employees: Employee[]) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const calculateAge = (birthday: string) => {
    const today = new Date();
    const birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getYearsOfService = (joinDate: string) => {
    const today = new Date();
    const joined = new Date(joinDate);
    let years = today.getFullYear() - joined.getFullYear();
    if (
      today.getMonth() < joined.getMonth() ||
      (today.getMonth() === joined.getMonth() && today.getDate() < joined.getDate())
    ) {
      years--;
    }
    return years;
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

  const isSameDate = (date1: string | Date, date2: Date) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth();
  };

  const todaysBirthdays = useMemo(() => {
    const today = new Date();
    return employees.filter(emp => isSameDate(emp.birthday, today));
  }, [employees]);

  const todayJoin = useMemo(() => {
    const today = new Date();
    return employees.filter(emp => isSameDate(emp.joinDate, today));
  }, [employees]);

  const birthdayEmployees = useMemo(() => {
    return employees.filter(emp => isSameDate(emp.birthday, selectedDate));
  }, [employees, selectedDate]);

  const joinEmployee = useMemo(() => {
    return employees.filter(emp => isSameDate(emp.joinDate, selectedDate));
  }, [employees, selectedDate]);

  const hasBirthdayOnDate = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return employees.some(emp => isSameDate(emp.birthday, date));
  };

  const isJoinDate = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return employees.some(emp => isSameDate(emp.joinDate, date));
  };

  const getMonthEvents = () => {
    const monthBirthdays = employees.filter(emp => 
      new Date(emp.birthday).getMonth() === currentMonth.getMonth()
    );
    const monthJoins = employees.filter(emp => 
      new Date(emp.joinDate).getMonth() === currentMonth.getMonth()
    );
    return { monthBirthdays, monthJoins };
  };

  return {
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
    isJoinDate,
    getMonthEvents
  };
};
