import { X, Gift, Mail, Edit, Calendar as CalendarIcon, Phone, MapPin } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { Employee } from '@shared/schema';

interface EmployeeDetailModalProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
  calculateAge: (birthday: string) => number;
  getYearsOfService: (joinDate: string) => number;
  formatDate: (dateStr: string) => string;
}

export default function EmployeeDetailModal({
  employee,
  isOpen,
  onClose,
  calculateAge,
  getYearsOfService,
  formatDate
}: EmployeeDetailModalProps) {
  if (!employee) return null;

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getNextBirthday = (birthday: string) => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const birthDate = new Date(birthday);
    let nextBirthday = new Date(currentYear, birthDate.getMonth(), birthDate.getDate());
    
    if (nextBirthday < today) {
      nextBirthday = new Date(currentYear + 1, birthDate.getMonth(), birthDate.getDate());
    }
    
    const diffTime = nextBirthday.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return {
      date: nextBirthday.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      days: diffDays
    };
  };

  const getNextAnniversary = (joinDate: string) => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const joinedDate = new Date(joinDate);
    let nextAnniversary = new Date(currentYear, joinedDate.getMonth(), joinedDate.getDate());
    
    if (nextAnniversary < today) {
      nextAnniversary = new Date(currentYear + 1, joinedDate.getMonth(), joinedDate.getDate());
    }
    
    const diffTime = nextAnniversary.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return {
      date: nextAnniversary.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      days: diffDays
    };
  };

  const nextBirthday = getNextBirthday(employee.birthday);
  const nextAnniversary = getNextAnniversary(employee.joinDate);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="bg-gradient-to-r from-purple-600 to-pink-600 -m-6 mb-0 p-6 text-white">
          <DialogTitle className="text-xl font-bold flex items-center justify-between">
            Employee Details
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Employee Header */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="employee-avatar w-24 h-24 text-2xl">
              {getInitials(employee.name)}
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-2xl font-bold text-gray-900">{employee.name}</h3>
              <p className="text-gray-600">{employee.position || 'Employee'}</p>
              <p className="text-sm text-gray-500">Employee ID: {employee.id}</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" className="bg-pink-100 text-pink-700 hover:bg-pink-200">
              <Gift className="w-4 h-4 mr-2" />
              Send Birthday Wish
            </Button>
            <Button variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
              <Mail className="w-4 h-4 mr-2" />
              Send Email
            </Button>
            <Button variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-200">
              <Edit className="w-4 h-4 mr-2" />
              Edit Details
            </Button>
          </div>

          {/* Employee Information Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Personal Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Personal Information</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-600">Date of Birth</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Gift className="w-4 h-4 text-pink-500" />
                    <span className="font-medium">{formatDate(employee.birthday)}</span>
                  </div>
                  <p className="text-sm text-gray-500">Age: {calculateAge(employee.birthday)} years</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Next Birthday</label>
                  <p className="font-medium">{nextBirthday.date}</p>
                  <p className="text-sm text-gray-500">in {nextBirthday.days} days</p>
                </div>
              </div>
            </div>

            {/* Work Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Work Information</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-600">Join Date</label>
                  <div className="flex items-center gap-2 mt-1">
                    <CalendarIcon className="w-4 h-4 text-blue-500" />
                    <span className="font-medium">{formatDate(employee.joinDate)}</span>
                  </div>
                  <p className="text-sm text-gray-500">{getYearsOfService(employee.joinDate)} years of service</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Next Anniversary</label>
                  <p className="font-medium">{nextAnniversary.date}</p>
                  <p className="text-sm text-gray-500">in {nextAnniversary.days} days</p>
                </div>
              </div>
            </div>

            {/* Department Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Department & Role</h4>
              <div className="space-y-2">
                <div>
                  <label className="text-sm text-gray-600">Department</label>
                  <p className="font-medium">{employee.department || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Position</label>
                  <p className="font-medium">{employee.position || 'Not specified'}</p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
              <div className="space-y-2">
                {employee.email && (
                  <div>
                    <label className="text-sm text-gray-600">Email</label>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-blue-500" />
                      <p className="font-medium text-blue-600">{employee.email}</p>
                    </div>
                  </div>
                )}
                {employee.phone && (
                  <div>
                    <label className="text-sm text-gray-600">Phone</label>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-green-500" />
                      <p className="font-medium">{employee.phone}</p>
                    </div>
                  </div>
                )}
                {employee.location && (
                  <div>
                    <label className="text-sm text-gray-600">Location</label>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-red-500" />
                      <p className="font-medium">{employee.location}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Celebration History */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Recent Celebrations</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-white rounded border-l-4 border-pink-500">
                <Gift className="w-6 h-6 text-pink-500" />
                <div>
                  <p className="font-medium">Birthday Celebration 2024</p>
                  <p className="text-sm text-gray-600">
                    {formatDate(employee.birthday)} - Turned {calculateAge(employee.birthday)} years old
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded border-l-4 border-blue-500">
                <CalendarIcon className="w-6 h-6 text-blue-500" />
                <div>
                  <p className="font-medium">Work Anniversary 2024</p>
                  <p className="text-sm text-gray-600">
                    {formatDate(employee.joinDate)} - {getYearsOfService(employee.joinDate)} years of service
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 -m-6 mt-0 p-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700">
            Edit Employee
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
