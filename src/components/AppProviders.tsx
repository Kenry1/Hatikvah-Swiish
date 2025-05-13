
import { ReactNode } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { OnboardingProvider } from '@/contexts/OnboardingContext';
import { ProcurementProvider } from '@/contexts/ProcurementContext';
import { RequestWorkflowProvider } from '@/contexts/RequestWorkflowContext';
import { EHSProvider } from '@/contexts/EHSContext';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { SidebarProvider } from '@/components/ui/sidebar';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <SidebarProvider>
        <AuthProvider>
          <OnboardingProvider>
            <ProcurementProvider>
              <RequestWorkflowProvider>
                <EHSProvider>
                  {children}
                  <Toaster />
                </EHSProvider>
              </RequestWorkflowProvider>
            </ProcurementProvider>
          </OnboardingProvider>
        </AuthProvider>
      </SidebarProvider>
    </ThemeProvider>
  );
}
