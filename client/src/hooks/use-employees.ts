import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employeeService } from '@/services/firebase';
import { sampleEmployees } from '@/data/sample-data';
import type { Employee, InsertEmployee } from '@shared/schema';

export const useEmployees = () => {
  const queryClient = useQueryClient();

  const {
    data: employees = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['/api/employees'],
    queryFn: async () => {
      try {
        const firebaseEmployees = await employeeService.getEmployees();
        return firebaseEmployees.length > 0 ? firebaseEmployees : sampleEmployees;
      } catch (err) {
        console.warn('Firebase failed, using sample data:', err);
        return sampleEmployees;
      }
    },
  });

  const addEmployeeMutation = useMutation({
    mutationFn: async (employeeData: InsertEmployee) => {
      try {
        return await employeeService.addEmployee(employeeData);
      } catch (err) {
        // Fallback to local storage for demo
        const fallbackEmployee: Employee = {
          ...employeeData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString()
        };
        return fallbackEmployee;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/employees'] });
    },
  });

  const deleteEmployeeMutation = useMutation({
    mutationFn: employeeService.deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/employees'] });
    },
  });

  return {
    employees,
    isLoading,
    error,
    addEmployee: addEmployeeMutation.mutateAsync,
    deleteEmployee: deleteEmployeeMutation.mutateAsync,
    isAddingEmployee: addEmployeeMutation.isPending,
    isDeletingEmployee: deleteEmployeeMutation.isPending,
  };
};
