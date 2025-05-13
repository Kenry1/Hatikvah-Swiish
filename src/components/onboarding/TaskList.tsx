
import React, { useState } from 'react';
import { OnboardingTask, UserOnboardingProgress } from '@/types/onboarding';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger, 
} from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, ChevronDown, ChevronUp } from "lucide-react";

interface TaskItemProps {
  task: OnboardingTask;
  progress?: UserOnboardingProgress;
}

const TaskItem = ({ task, progress }: TaskItemProps) => {
  const { completeTask, uncompleteTask } = useOnboarding();
  const [isOpen, setIsOpen] = useState(false);
  const [notes, setNotes] = useState(progress?.notes || '');
  const isCompleted = progress?.completed || false;

  const handleToggleComplete = async (checked: boolean) => {
    if (checked) {
      await completeTask(task.id, notes);
    } else {
      await uncompleteTask(task.id);
    }
  };

  const handleSaveNotes = async () => {
    await completeTask(task.id, notes);
  };

  return (
    <Card className={isCompleted ? "border-green-100 bg-green-50" : ""}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id={`task-${task.id}`} 
              checked={isCompleted}
              onCheckedChange={handleToggleComplete}
            />
            <div>
              <CardTitle className="text-lg">{task.title}</CardTitle>
              {task.estimated_time && (
                <CardDescription className="flex items-center mt-1">
                  <Clock className="w-3 h-3 mr-1" /> {task.estimated_time}
                </CardDescription>
              )}
            </div>
          </div>
          <Badge variant={task.is_required ? "destructive" : "outline"}>
            {task.is_required ? "Required" : "Optional"}
          </Badge>
        </div>
      </CardHeader>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full flex justify-between items-center p-2">
            <span className="text-xs text-muted-foreground">
              {isOpen ? "Hide details" : "Show details"}
            </span>
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          {task.description && (
            <CardContent className="pt-0">
              <p className="text-sm">{task.description}</p>
            </CardContent>
          )}
          <CardContent className="pt-2">
            <div className="space-y-2">
              <label htmlFor={`notes-${task.id}`} className="text-sm font-medium">
                Notes
              </label>
              <Textarea
                id={`notes-${task.id}`}
                placeholder="Add notes about this task (optional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              size="sm" 
              onClick={handleSaveNotes}
              disabled={isCompleted && notes === progress?.notes}
            >
              Save Notes
            </Button>
          </CardFooter>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export const TaskList = () => {
  const { tasks, progress } = useOnboarding();

  if (!tasks.length) {
    return (
      <Card>
        <CardContent className="py-6">
          <div className="text-center text-muted-foreground">
            No onboarding tasks available for your department.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {tasks
        .sort((a, b) => {
          // Use sequence_order if available, otherwise fallback to order
          const aOrder = a.sequence_order !== undefined ? a.sequence_order : (a.order || 0);
          const bOrder = b.sequence_order !== undefined ? b.sequence_order : (b.order || 0);
          return aOrder - bOrder;
        })
        .map(task => {
          const taskProgress = progress.find(p => p.task_id === task.id);
          return (
            <TaskItem 
              key={task.id} 
              task={task} 
              progress={taskProgress}
            />
          );
        })
      }
    </div>
  );
};
