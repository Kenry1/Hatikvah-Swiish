
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Fuel } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const FuelRequestsOverview = () => {
  const navigate = useNavigate();

  const recentRequests = [
    {
      id: 1,
      user: 'Alex Technician',
      vehicle: 'Toyota Hilux',
      amount: 45,
      status: 'Pending',
      time: '2 hours ago'
    },
    {
      id: 2,
      user: 'Jane Engineer',
      vehicle: 'Ford Ranger',
      amount: 35,
      status: 'Pending',
      time: '5 hours ago'
    },
    {
      id: 3,
      user: 'Mike Installer',
      vehicle: 'Isuzu D-Max',
      amount: 50,
      status: 'Approved',
      time: 'Yesterday'
    }
  ];

  return (
    <div className="space-y-4">
      {recentRequests.map((request) => (
        <div key={request.id} className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-9 w-9 rounded-full bg-amber-100 flex items-center justify-center">
              <Fuel className="h-5 w-5 text-amber-700" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium">{request.user}</p>
                <Badge variant={request.status === 'Approved' ? 'default' : 'secondary'}>
                  {request.status}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {request.vehicle} • {request.amount} liters • {request.time}
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/logistics/fuel-requests')}
          >
            Review
          </Button>
        </div>
      ))}
      
      <div className="mt-4 flex justify-center">
        <Button 
          variant="outline"
          onClick={() => navigate('/logistics/fuel-requests')}
        >
          View All Requests
        </Button>
      </div>
    </div>
  );
};
