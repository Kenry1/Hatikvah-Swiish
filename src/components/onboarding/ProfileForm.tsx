
import React, { useState } from 'react';
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DepartmentSelector } from "./DepartmentSelector";
import { DepartmentType } from "@/types/onboarding";

export const ProfileForm = () => {
  const { profile, updateProfile, loading } = useOnboarding();
  
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    position: profile?.position || '',
    department: profile?.department || '',
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDepartmentChange = (value: string) => {
    setFormData(prev => ({ ...prev, department: value as DepartmentType }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name || ''}
          onChange={handleChange}
          placeholder="Enter your full name"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          value={profile?.email || ''}
          disabled
          className="bg-muted"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="department">Department</Label>
        <DepartmentSelector 
          value={formData.department}
          onValueChange={handleDepartmentChange}
          placeholder="Select your department"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="position">Position</Label>
        <Input
          id="position"
          name="position"
          value={formData.position || ''}
          onChange={handleChange}
          placeholder="Enter your job position"
        />
      </div>
      
      <Button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Save Profile'}
      </Button>
    </form>
  );
};
