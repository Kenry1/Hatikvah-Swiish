
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PurchaseRequest } from '@/types';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

interface OrderTrackingProps {
  requests: PurchaseRequest[];
}

const OrderTrackingSection: React.FC<OrderTrackingProps> = ({ requests }) => {
  const [trackingId, setTrackingId] = useState('');
  const [trackingResult, setTrackingResult] = useState<PurchaseRequest | null>(null);
  
  const handleTrack = () => {
    if (!trackingId) {
      toast({
        title: "Tracking ID Required",
        description: "Please enter a request ID to track",
        variant: "destructive",
      });
      return;
    }
    
    const foundRequest = requests.find(req => req.id === trackingId);
    if (foundRequest) {
      setTrackingResult(foundRequest);
    } else {
      toast({
        title: "Request Not Found",
        description: "No request found with that ID",
        variant: "destructive",
      });
      setTrackingResult(null);
    }
  };
  
  const getStatusStep = (status: string) => {
    switch (status) {
      case 'pending':
        return 1;
      case 'approved':
        return 2;
      case 'rejected':
        return -1; // Special case
      case 'completed':
        return 3;
      default:
        return 0;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Enter Request ID (e.g. PR-123456789)"
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
          className="flex-1"
        />
        <Button onClick={handleTrack}>Track Request</Button>
      </div>
      
      {trackingResult && (
        <Card>
          <CardHeader>
            <CardTitle>Request: {trackingResult.id}</CardTitle>
            <CardDescription>
              Requested by {trackingResult.requester} on {format(new Date(trackingResult.date), 'MMMM dd, yyyy')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium">Item</p>
                <p>{trackingResult.item} (Quantity: {trackingResult.quantity})</p>
              </div>
              
              <div className="relative">
                {getStatusStep(trackingResult.status) === -1 ? (
                  <div className="pt-2">
                    <p className="text-sm font-medium text-red-700">Request Rejected</p>
                    <p className="text-sm text-muted-foreground">
                      This request was rejected
                      {trackingResult.approvedBy ? ` by ${trackingResult.approvedBy}` : ''}.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex mb-6">
                      <div className="w-1/3 flex flex-col items-center">
                        <div className={`rounded-full h-8 w-8 flex items-center justify-center ${
                          getStatusStep(trackingResult.status) >= 1 
                            ? 'bg-primary text-primary-foreground' 
                            : 'border border-muted-foreground text-muted-foreground'
                        }`}>
                          1
                        </div>
                        <p className="text-sm mt-1">Submitted</p>
                      </div>
                      
                      <div className="w-1/3 flex flex-col items-center">
                        <div className={`rounded-full h-8 w-8 flex items-center justify-center ${
                          getStatusStep(trackingResult.status) >= 2 
                            ? 'bg-primary text-primary-foreground' 
                            : 'border border-muted-foreground text-muted-foreground'
                        }`}>
                          2
                        </div>
                        <p className="text-sm mt-1">Approved</p>
                      </div>
                      
                      <div className="w-1/3 flex flex-col items-center">
                        <div className={`rounded-full h-8 w-8 flex items-center justify-center ${
                          getStatusStep(trackingResult.status) >= 3 
                            ? 'bg-primary text-primary-foreground' 
                            : 'border border-muted-foreground text-muted-foreground'
                        }`}>
                          3
                        </div>
                        <p className="text-sm mt-1">Completed</p>
                      </div>
                    </div>
                    <div className="absolute top-4 left-[16.67%] right-[16.67%] h-0.5 bg-muted-foreground/30"></div>
                  </>
                )}
              </div>
              
              {trackingResult.notes && (
                <div>
                  <p className="text-sm font-medium">Notes</p>
                  <p className="text-sm text-muted-foreground">{trackingResult.notes}</p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              Current Status: <span className="font-medium text-foreground capitalize">{trackingResult.status}</span>
            </p>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default OrderTrackingSection;
