import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthPage } from "./pages/AuthPage";
import { Dashboard } from "./pages/Dashboard";
import { CropDetails } from "./pages/CropDetails";

const queryClient = new QueryClient();

const App = () => {
  const [user, setUser] = useState<{ email: string; name: string } | null>(
    null
  );

  const handleLogin = (userData: { email: string; name: string }) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="ai-crop-planner-theme">
        <TooltipProvider>
          <Router>
            <Toaster />
            <Sonner />
            <LanguageProvider>
              {user ? (
                <Routes>
                  <Route
                    path="/"
                    element={<Dashboard user={user} onLogout={handleLogout} />}
                  />
                  <Route
                    path="/dashboard"
                    element={<Dashboard user={user} onLogout={handleLogout} />}
                  />
                  <Route path="/crop-details" element={<CropDetails />} />
                </Routes>
              ) : (
                <AuthPage onSuccess={handleLogin} />
              )}
            </LanguageProvider>
          </Router>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
