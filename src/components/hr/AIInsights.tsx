
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, AlertTriangle, TrendingUp, Award } from "lucide-react";

// Mock data - in a real app this would come from an AI analysis API
const insights = [
  {
    type: 'promotion',
    title: 'Promotion Eligible',
    description: 'These employees might be ready for promotion based on performance metrics',
    employees: [
      { name: 'John Doe', reason: '2+ years in position, consistently exceeding targets' },
      { name: 'Sarah Smith', reason: 'High performer, leading multiple successful projects' }
    ],
    icon: <Award className="h-5 w-5" />,
    color: 'text-green-600'
  },
  {
    type: 'leave',
    title: 'Leave Exhaustion',
    description: 'Employees approaching maximum leave allowance',
    employees: [
      { name: 'Emma Brown', reason: 'Used 80% of annual leave, 3 weeks remaining' },
      { name: 'Alex Wilson', reason: 'Used 75% of annual leave, frequent short breaks' }
    ],
    icon: <AlertTriangle className="h-5 w-5" />,
    color: 'text-amber-500'
  },
  {
    type: 'performance',
    title: 'Performance Concerns',
    description: 'Employees showing potential performance issues',
    employees: [
      { name: 'Michael Chang', reason: 'Task completion rate dropping 15% in last month' },
      { name: 'Lisa Taylor', reason: 'Increasing sick leave patterns on Mondays/Fridays' }
    ],
    icon: <TrendingUp className="h-5 w-5" />,
    color: 'text-red-500'
  },
  {
    type: 'anomaly',
    title: 'Anomalies Detected',
    description: 'Unusual patterns that may require attention',
    employees: [
      { name: 'Robert Lee', reason: 'Working hours exceed department average by 40%' },
      { name: 'Tina Murphy', reason: 'Unusually high overtime hours compared to peers' }
    ],
    icon: <Users className="h-5 w-5" />,
    color: 'text-blue-500'
  }
];

type InsightCardProps = {
  title: string;
  description: string;
  employees: { name: string; reason: string }[];
  icon: React.ReactNode;
  color: string;
};

const InsightCard = ({ title, description, employees, icon, color }: InsightCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center gap-2 pb-2">
      <div className={`rounded-full p-2 ${color} bg-opacity-10`}>
        {icon}
      </div>
      <div>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription className="text-xs">{description}</CardDescription>
      </div>
    </CardHeader>
    <CardContent className="pt-0">
      {employees.map((employee, index) => (
        <div key={index} className="mb-3 last:mb-0">
          <div className="flex items-center justify-between">
            <span className="font-medium text-sm">{employee.name}</span>
            <Badge variant="outline" className="text-xs">AI Insight</Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{employee.reason}</p>
        </div>
      ))}
    </CardContent>
  </Card>
);

export const AIInsights = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">AI Insights & Recommendations</h2>
        <Badge variant="outline" className="text-xs">AI-Powered</Badge>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {insights.map((insight, index) => (
          <InsightCard
            key={index}
            title={insight.title}
            description={insight.description}
            employees={insight.employees}
            icon={insight.icon}
            color={insight.color}
          />
        ))}
      </div>
    </div>
  );
};
