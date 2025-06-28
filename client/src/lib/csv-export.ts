import type { Employee } from '@shared/schema';

interface CSVExportOptions {
  filename?: string;
  includeAge?: boolean;
  includeYearsOfService?: boolean;
  dateFormat?: 'full' | 'short';
}

export const csvExportUtils = {
  // Calculate age helper
  calculateAge: (birthday: string): number => {
    const today = new Date();
    const birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  },

  // Calculate years of service helper
  getYearsOfService: (joinDate: string): number => {
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
  },

  // Format date helper
  formatDate: (dateStr: string, format: 'full' | 'short' = 'short'): string => {
    const date = new Date(dateStr);
    if (format === 'full') {
      return date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    }
    return date.toLocaleDateString('en-US');
  },

  // Export employees to CSV
  exportEmployeesToCSV: (
    employees: Employee[], 
    options: CSVExportOptions = {}
  ): void => {
    const {
      filename = `employees-${new Date().toISOString().split('T')[0]}`,
      includeAge = true,
      includeYearsOfService = true,
      dateFormat = 'short'
    } = options;

    const headers = [
      'ID',
      'Name',
      'Birthday',
      ...(includeAge ? ['Age'] : []),
      'Join Date',
      ...(includeYearsOfService ? ['Years of Service'] : []),
      'Department',
      'Position',
      'Email',
      'Phone',
      'Location'
    ];

    const csvContent = [
      headers.join(','),
      ...employees.map(emp => [
        emp.id,
        emp.name,
        csvExportUtils.formatDate(emp.birthday, dateFormat),
        ...(includeAge ? [csvExportUtils.calculateAge(emp.birthday)] : []),
        csvExportUtils.formatDate(emp.joinDate, dateFormat),
        ...(includeYearsOfService ? [csvExportUtils.getYearsOfService(emp.joinDate)] : []),
        emp.department || '',
        emp.position || '',
        emp.email || '',
        emp.phone || '',
        emp.location || ''
      ].map(field => `"${field}"`).join(','))
    ].join('\n');

    csvExportUtils.downloadCSV(csvContent, `${filename}.csv`);
  },

  // Export birthday calendar to CSV
  exportBirthdayCalendar: (employees: Employee[]): void => {
    const headers = ['Name', 'Date', 'Age', 'Department'];
    
    const birthdayEvents = employees.map(emp => [
      emp.name,
      csvExportUtils.formatDate(emp.birthday, 'full'),
      csvExportUtils.calculateAge(emp.birthday),
      emp.department || 'Not specified'
    ]);

    const csvContent = [
      headers.join(','),
      ...birthdayEvents.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n');

    csvExportUtils.downloadCSV(csvContent, `birthday-calendar-${new Date().toISOString().split('T')[0]}.csv`);
  },

  // Export work anniversary calendar to CSV
  exportAnniversaryCalendar: (employees: Employee[]): void => {
    const headers = ['Name', 'Join Date', 'Years of Service', 'Department'];
    
    const anniversaryEvents = employees.map(emp => [
      emp.name,
      csvExportUtils.formatDate(emp.joinDate, 'full'),
      csvExportUtils.getYearsOfService(emp.joinDate),
      emp.department || 'Not specified'
    ]);

    const csvContent = [
      headers.join(','),
      ...anniversaryEvents.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n');

    csvExportUtils.downloadCSV(csvContent, `anniversary-calendar-${new Date().toISOString().split('T')[0]}.csv`);
  },

  // Export upcoming events (next 30 days)
  exportUpcomingEvents: (employees: Employee[]): void => {
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    const upcomingEvents: Array<{
      name: string;
      date: string;
      type: string;
      daysUntil: number;
      details: string;
    }> = [];

    employees.forEach(emp => {
      // Check birthdays
      const currentYear = today.getFullYear();
      const birthDate = new Date(emp.birthday);
      let nextBirthday = new Date(currentYear, birthDate.getMonth(), birthDate.getDate());
      
      if (nextBirthday < today) {
        nextBirthday = new Date(currentYear + 1, birthDate.getMonth(), birthDate.getDate());
      }
      
      if (nextBirthday <= thirtyDaysFromNow) {
        const daysUntil = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        upcomingEvents.push({
          name: emp.name,
          date: csvExportUtils.formatDate(nextBirthday.toISOString(), 'full'),
          type: 'Birthday',
          daysUntil,
          details: `Turning ${csvExportUtils.calculateAge(emp.birthday) + 1} years old`
        });
      }

      // Check work anniversaries
      const joinDate = new Date(emp.joinDate);
      let nextAnniversary = new Date(currentYear, joinDate.getMonth(), joinDate.getDate());
      
      if (nextAnniversary < today) {
        nextAnniversary = new Date(currentYear + 1, joinDate.getMonth(), joinDate.getDate());
      }
      
      if (nextAnniversary <= thirtyDaysFromNow) {
        const daysUntil = Math.ceil((nextAnniversary.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        upcomingEvents.push({
          name: emp.name,
          date: csvExportUtils.formatDate(nextAnniversary.toISOString(), 'full'),
          type: 'Work Anniversary',
          daysUntil,
          details: `${csvExportUtils.getYearsOfService(emp.joinDate) + 1} years of service`
        });
      }
    });

    // Sort by days until event
    upcomingEvents.sort((a, b) => a.daysUntil - b.daysUntil);

    const headers = ['Name', 'Event Type', 'Date', 'Days Until', 'Details'];
    const csvContent = [
      headers.join(','),
      ...upcomingEvents.map(event => [
        event.name,
        event.type,
        event.date,
        event.daysUntil,
        event.details
      ].map(field => `"${field}"`).join(','))
    ].join('\n');

    csvExportUtils.downloadCSV(csvContent, `upcoming-events-${new Date().toISOString().split('T')[0]}.csv`);
  },

  // Helper function to download CSV
  downloadCSV: (csvContent: string, filename: string): void => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
};