
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { useOnboarding } from "@/contexts/OnboardingContext";

export const OnboardingProgress = () => {
  const { tasks, progress } = useOnboarding();
  
  // Calculate completion percentage
  const completedTasks = progress.filter(p => p.completed).length;
  const totalTasks = tasks.length;
  const completionPercentage = totalTasks > 0 
    ? Math.round((completedTasks / totalTasks) * 100) 
    : 0;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">Onboarding Progress</span>
        <span className="text-sm text-muted-foreground">
          {completedTasks} of {totalTasks} tasks completed
        </span>
      </div>
      <Progress value={completionPercentage} className="h-2" />
    </div>
  );
};
