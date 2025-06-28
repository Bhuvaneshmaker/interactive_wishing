import React, { useState } from 'react';
import { Users, Plus } from 'lucide-react';

const EmployeeForm = ({ onAddEmployee, isLoading }) => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    birthday: '',
    joinDate: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onAddEmployee(formData);
      setFormData({ id: '', name: '', birthday: '', joinDate: '' });
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Users className="text-purple-600" />
        Add New Employee
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Employee ID :
          </label>
          <input
            type="string"
            name="id"
            value={formData.id}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Enter employee ID"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Employee Name :
          </label>
          <input
            type="string"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Enter full name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date of Birth :
          </label>
          <input
            type="date"
            name="birthday"
            placeholder = "Date of Birth"
            value={formData.birthday}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Joining Date
          </label>
          <input
            type="date"
            name="joinDate"
            placeholder="Date of Joining"
            value={formData.joinDate}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 focus:ring-4 focus:ring-purple-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Plus className="w-5 h-5" />
          )}
          {isLoading ? 'Adding Employee...' : 'Add Employee'}
        </button>
      </form>
    </div>
  );
};

export default EmployeeForm;
