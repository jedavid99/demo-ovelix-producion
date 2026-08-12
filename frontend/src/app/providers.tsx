import { AppProvider } from "@/app/shared/contexts/AppContext"
import { AuthProvider } from "@/contexts/AuthContext"
import { LoadingProvider } from "@/contexts/LoadingContext"
import { ThemeProvider } from "@/contexts/ThemeContext"
import { GlobalLoader } from "@/shared/components/GlobalLoader"
import { Toaster } from "@/shared/components/ui/toaster"
import { TutorialProvider } from "@/features/tutorial"
import { GuidedTour, HelpTourButton } from "@/features/tutorial"
import { TourProvider } from "@/features/tutorial"
function LayoutContent({ children }: { children: React.ReactNode }) {
  return <main className="min-h-screen bg-background text-foreground">{children}</main>
}
export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AppProvider>
        <LoadingProvider>
          <AuthProvider>
            <TutorialProvider>
              <TourProvider>
                <GlobalLoader />
                <Toaster />
                <GuidedTour />
                <HelpTourButton />
                <LayoutContent>{children}</LayoutContent>
              </TourProvider>
            </TutorialProvider>
          </AuthProvider>
        </LoadingProvider>
      </AppProvider>
    </ThemeProvider>
  )
}
