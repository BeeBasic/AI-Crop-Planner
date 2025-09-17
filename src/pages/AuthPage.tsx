import { useState } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";

interface AuthPageProps {
  onSuccess: (user: { email: string; name: string }) => void;
}

export const AuthPage = ({ onSuccess }: AuthPageProps) => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-[var(--gradient-earth)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 shadow-[var(--shadow-card)] overflow-hidden bg-transparent">
            <img
              src="/favicon.jpeg"
              alt="App logo"
              className="h-20 w-20 object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            AI Crop Planner
          </h1>
          <p className="text-muted-foreground mt-2">
            Smart farming solutions for better harvests
          </p>
        </div>

        {/* Auth Forms */}
        {isLogin ? (
          <LoginForm
            onSuccess={onSuccess}
            onSwitchToSignup={() => setIsLogin(false)}
          />
        ) : (
          <SignupForm
            onSuccess={onSuccess}
            onSwitchToLogin={() => setIsLogin(true)}
          />
        )}
      </div>
    </div>
  );
};
