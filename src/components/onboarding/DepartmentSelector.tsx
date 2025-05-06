
import React from 'react';
import { DepartmentType } from "@/types/onboarding";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface DepartmentSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  includeAllOption?: boolean;
}

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

export const DepartmentSelector = ({ value, onValueChange, placeholder = "Select department", includeAllOption = false }: DepartmentSelectorProps) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {includeAllOption && (
          <SelectItem value="all">All Departments</SelectItem>
        )}
        {departmentOptions.map(option => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
