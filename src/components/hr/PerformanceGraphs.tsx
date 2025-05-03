
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartLegend } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ChartBarIcon, Clock, CalendarDays, CheckCheck } from "lucide-react";

// Mock data - in a real application, this would come from the API
const productivityData = [
  { name: 'John Doe', value: 87 },
  { name: 'Sarah Smith', value: 75 },
  { name: 'Mike Johnson', value: 92 },
  { name: 'Emma Brown', value: 68 },
  { name: 'Alex Wilson', value: 84 },
];

const leaveData = [
  { name: 'John Doe', value: 12 },
  { name: 'Sarah Smith', value: 7 },
  { name: 'Mike Johnson', value: 3 },
  { name: 'Emma Brown', value: 15 },
  { name: 'Alex Wilson', value: 5 },
];

const fieldTripData = [
  { name: 'John Doe', value: 24 },
  { name: 'Sarah Smith', value: 48 },
  { name: 'Mike Johnson', value: 16 },
  { name: 'Emma Brown', value: 32 },
  { name: 'Alex Wilson', value: 56 },
];

const tasksData = [
  { name: 'John Doe', value: 43 },
  { name: 'Sarah Smith', value: 37 },
  { name: 'Mike Johnson', value: 58 },
  { name: 'Emma Brown', value: 29 },
  { name: 'Alex Wilson', value: 41 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

type ChartProps = {
  data: { name: string; value: number }[];
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  chartType: 'bar' | 'pie';
  onClick: () => void;
};

const PerformanceChart = ({ data, title, subtitle, icon, chartType, onClick }: ChartProps) => (
  <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <div>
        <CardTitle className="text-base font-medium">{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </div>
      <div className="text-muted-foreground">{icon}</div>
    </CardHeader>
    <CardContent>
      <div className="h-[200px]">
        {chartType === 'bar' ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name }) => name}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </CardContent>
  </Card>
);

export const PerformanceGraphs = () => {
  const handleViewDetails = (chartType: string) => {
    // In a real app, this would navigate to a detailed view
    console.log(`Viewing detailed analytics for ${chartType}`);
    // You can implement navigation to detailed views here
  };
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <PerformanceChart
        data={productivityData}
        title="Most Productive Employee"
        subtitle="Based on performance metrics"
        icon={<ChartBarIcon />}
        chartType="bar"
        onClick={() => handleViewDetails('productivity')}
      />
      
      <PerformanceChart
        data={leaveData}
        title="Leave Days Taken"
        subtitle="Top employees by leave usage"
        icon={<CalendarDays />}
        chartType="pie"
        onClick={() => handleViewDetails('leave')}
      />
      
      <PerformanceChart
        data={fieldTripData}
        title="Field Trip Hours"
        subtitle="Hours logged on field trips"
        icon={<Clock />}
        chartType="bar"
        onClick={() => handleViewDetails('fieldTrip')}
      />
      
      <PerformanceChart
        data={tasksData}
        title="Completed Tasks"
        subtitle="Task completion by employees"
        icon={<CheckCheck />}
        chartType="pie"
        onClick={() => handleViewDetails('tasks')}
      />
    </div>
  );
};
