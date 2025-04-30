
import React from 'react';
import { Button } from '@/components/ui/button';
import { Car, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const VehiclesOverview = () => {
  const navigate = useNavigate();

  const recentActivities = [
    {
      id: 1,
      type: 'assignment',
      vehicle: 'Toyota Hilux',
      registration: 'KBC 123D',
      user: 'Alex Technician',
      time: '2 hours ago',
      icon: <Car className="h-5 w-5 text-blue-700" />
    },
    {
      id: 2,
      type: 'maintenance',
      vehicle: 'Isuzu D-Max',
      registration: 'KCA 789Q',
      alert: 'Maintenance Due',
      time: 'Yesterday',
      icon: <AlertCircle className="h-5 w-5 text-red-700" />
    },
    {
      id: 3,
      type: 'assignment',
      vehicle: 'Ford Ranger',
      registration: 'KDD 456P',
      user: 'Jane Engineer',
      time: '2 days ago',
      icon: <Car className="h-5 w-5 text-blue-700" />
    }
  ];

  return (
    <div className="space-y-4">
      {recentActivities.map((activity) => (
        <div key={activity.id} className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
              {activity.icon}
            </div>
            <div>
              <p className="text-sm font-medium">
                {activity.vehicle} ({activity.registration})
              </p>
              <p className="text-xs text-muted-foreground">
                {activity.type === 'assignment' 
                  ? `Assigned to ${activity.user}` 
                  : activity.alert} • {activity.time}
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/logistics/vehicles')}
          >
            View
          </Button>
        </div>
      ))}
      
      <div className="mt-4 flex justify-center">
        <Button 
          variant="outline"
          onClick={() => navigate('/logistics/vehicles')}
        >
          View All Vehicles
        </Button>
      </div>
    </div>
  );
};
