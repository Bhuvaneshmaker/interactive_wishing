import { useState } from 'react';
import { Users, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { InsertEmployee } from '@shared/schema';

interface EmployeeFormProps {
  onAddEmployee: (employee: InsertEmployee) => Promise<void>;
  isLoading: boolean;
}

export default function EmployeeForm({ onAddEmployee, isLoading }: EmployeeFormProps) {
  const [formData, setFormData] = useState<InsertEmployee>({
    id: '',
    name: '',
    birthday: '',
    joinDate: '',
    department: '',
    position: '',
    email: '',
    phone: '',
    location: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onAddEmployee(formData);
      setFormData({
        id: '',
        name: '',
        birthday: '',
        joinDate: '',
        department: '',
        position: '',
        email: '',
        phone: '',
        location: ''
      });
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
      <h3 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2">
        <Users className="text-purple-600" />
        Add New Employee
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="id">Employee ID</Label>
            <Input
              id="id"
              name="id"
              value={formData.id}
              onChange={handleChange}
              placeholder="Enter employee ID"
              required
            />
          </div>
          <div>
            <Label htmlFor="name">Employee Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter full name"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="birthday">Date of Birth</Label>
            <Input
              id="birthday"
              name="birthday"
              type="date"
              value={formData.birthday}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="joinDate">Joining Date</Label>
            <Input
              id="joinDate"
              name="joinDate"
              type="date"
              value={formData.joinDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              name="department"
              value={formData.department || ''}
              onChange={handleChange}
              placeholder="Enter department"
            />
          </div>
          <div>
            <Label htmlFor="position">Position</Label>
            <Input
              id="position"
              name="position"
              value={formData.position || ''}
              onChange={handleChange}
              placeholder="Enter position"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email || ''}
              onChange={handleChange}
              placeholder="Enter email"
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone || ''}
              onChange={handleChange}
              placeholder="Enter phone"
            />
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              value={formData.location || ''}
              onChange={handleChange}
              placeholder="Enter location"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
          ) : (
            <Plus className="w-5 h-5 mr-2" />
          )}
          {isLoading ? 'Adding Employee...' : 'Add Employee'}
        </Button>
      </form>
    </div>
  );
}
