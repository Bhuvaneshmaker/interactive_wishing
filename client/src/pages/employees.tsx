import { useState } from 'react';
import { useEmployees } from '@/hooks/use-employees';
import { useDateFilters } from '@/hooks/use-date-filters';
import EmployeeDetailModal from '@/components/employee-detail-modal';
import { csvExportUtils } from '@/lib/csv-export';
import { Search, Download, Plus, Eye, Edit, Trash2, Calendar, Users, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { Employee } from '@shared/schema';

export default function Employees() {
  const { employees, isLoading } = useEmployees();
  const { calculateAge, getYearsOfService, formatDate } = useDateFilters(employees);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getDepartments = () => {
    const departmentSet = new Set<string>();
    employees.forEach(emp => {
      if (emp.department) {
        departmentSet.add(emp.department);
      }
    });
    return Array.from(departmentSet);
  };

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (emp.department?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesDepartment = departmentFilter === 'all' || emp.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  const handleEmployeeDetail = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleExportEmployees = () => {
    csvExportUtils.exportEmployeesToCSV(filteredEmployees, {
      filename: `filtered-employees-${new Date().toISOString().split('T')[0]}`
    });
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-purple-600 font-medium">Loading employees...</p>
        </div>
      </div>
    );
  }

  const thisMonthBirthdays = employees.filter(emp => 
    new Date(emp.birthday).getMonth() === new Date().getMonth()
  ).length;

  const thisMonthAnniversaries = employees.filter(emp => 
    new Date(emp.joinDate).getMonth() === new Date().getMonth()
  ).length;

  return (
    <div className="page-transition">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Header with Search and Actions */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Employee Directory</h1>
              <p className="text-gray-600 text-sm sm:text-base">Manage and view all employee information</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Export Data</span>
                    <span className="sm:hidden">Export</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={handleExportEmployees}>
                    <Users className="w-4 h-4 mr-2" />
                    Employee List ({filteredEmployees.length})
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExportBirthdays}>
                    <Calendar className="w-4 h-4 mr-2" />
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
              <Button className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Employee</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search employees by name, ID, or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {getDepartments().map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Employee Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600">{employees.length}</div>
              <div className="text-xs sm:text-sm text-gray-600">Total Employees</div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-green-600">{filteredEmployees.length}</div>
              <div className="text-xs sm:text-sm text-gray-600">Filtered Results</div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-purple-600">{thisMonthBirthdays}</div>
              <div className="text-xs sm:text-sm text-gray-600">This Month Birthdays</div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-orange-600">{thisMonthAnniversaries}</div>
              <div className="text-xs sm:text-sm text-gray-600">This Month Anniversaries</div>
            </div>
          </div>
        </div>

        {/* Employee List */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              All Employees ({filteredEmployees.length})
            </h2>
          </div>

          {/* Mobile View */}
          <div className="block sm:hidden">
            {filteredEmployees.map((employee) => (
              <div key={employee.id} className="border-b border-gray-200 p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="employee-avatar w-12 h-12 text-sm">
                      {getInitials(employee.name)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{employee.name}</h3>
                      <p className="text-sm text-gray-600">ID: {employee.id}</p>
                      {employee.department && (
                        <p className="text-sm text-gray-500">{employee.department}</p>
                      )}
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-pink-500">🎂</span>
                          <span>{new Date(employee.birthday).toLocaleDateString()} ({calculateAge(employee.birthday)} years)</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-blue-500">📅</span>
                          <span>{new Date(employee.joinDate).toLocaleDateString()} ({getYearsOfService(employee.joinDate)} years)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEmployeeDetail(employee)}
                      className="text-purple-600 hover:bg-purple-50 p-2"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-gray-400 hover:bg-gray-50 p-2"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Birthday</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Years</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="employee-avatar">
                          {getInitials(employee.name)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                          <div className="text-sm text-gray-500">{employee.department || 'No department'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-1">
                        <span className="text-pink-500">🎂</span>
                        {new Date(employee.birthday).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-1">
                        <span className="text-blue-500">📅</span>
                        {new Date(employee.joinDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getYearsOfService(employee.joinDate)} years
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEmployeeDetail(employee)}
                          className="text-purple-600 hover:text-purple-900"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* No Results */}
          {filteredEmployees.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👥</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No employees found</h3>
              <p className="text-gray-500">Try adjusting your search criteria</p>
            </div>
          )}
        </div>

        {/* Employee Detail Modal */}
        <EmployeeDetailModal
          employee={selectedEmployee}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          calculateAge={calculateAge}
          getYearsOfService={getYearsOfService}
          formatDate={formatDate}
        />
      </div>
    </div>
  );
}
