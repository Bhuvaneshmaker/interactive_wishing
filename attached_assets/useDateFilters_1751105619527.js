import { useState,useMemo } from 'react';

export const useDateFilters = (employees) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Helper functions
  const calculateAge = (birthday) => {
    const today = new Date();
    const birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getYearsOfService = (joinDate) => {
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

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

  const isSameDate = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth();
  };

  // Computed values
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

  // Calendar helper functions
  const hasBirthdayOnDate = (day) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return employees.some(emp => isSameDate(emp.birthday, date));
  };

  const isJoinDate = (day) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return employees.some(emp => isSameDate(emp.joinDate, date));
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
    isJoinDate
  };
};