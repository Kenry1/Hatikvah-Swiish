
import { ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { EHSProvider } from '@/contexts/EHSContext';
import { ProcurementProvider } from '@/contexts/ProcurementContext';
import { OnboardingProvider } from '@/contexts/OnboardingContext';

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  // Create a new QueryClient instance inside the component
  const [queryClient] = useState(() => new QueryClient());
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <EHSProvider>
            <ProcurementProvider>
              <OnboardingProvider>
                <TooltipProvider>
                  <Toaster />
                  <Sonner />
                  {children}
                </TooltipProvider>
              </OnboardingProvider>
            </ProcurementProvider>
          </EHSProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};
