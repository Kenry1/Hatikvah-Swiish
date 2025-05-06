
import React from 'react';
import { useOnboarding } from "@/contexts/OnboardingContext";
import { DepartmentType } from "@/types/onboarding";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const departmentOptions: { value: DepartmentType; label: string }[] = [
  { value: 'engineering', label: 'Engineering' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'sales', label: 'Sales' },
  { value: 'hr', label: 'Human Resources' },
  { value: 'operations', label: 'Operations' },
  { value: 'finance', label: 'Finance' },
  { value: 'it', label: 'IT' },
  { value: 'warehouse', label: 'Warehouse' },
  { value: 'logistics', label: 'Logistics' },
  { value: 'ehs', label: 'EHS' },
  { value: 'management', label: 'Management' },
  { value: 'planning', label: 'Planning' },
  { value: 'procurement', label: 'Procurement' },
];

export const DepartmentSelector = () => {
  const { profile, updateProfile } = useOnboarding();
  
  const handleDepartmentChange = (department: DepartmentType) => {
    updateProfile({ department });
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="department">Department</Label>
      <Select
        value={profile?.department || ""}
        onValueChange={handleDepartmentChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select your department" />
        </SelectTrigger>
        <SelectContent>
          {departmentOptions.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
