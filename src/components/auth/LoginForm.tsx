import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Mail, Lock, Chrome } from "lucide-react";
import { auth, googleProvider } from "@/services/firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";

interface LoginFormProps {
  onSuccess: (user: { email: string; name: string }) => void;
  onSwitchToSignup: () => void;
}

export const LoginForm = ({ onSuccess, onSwitchToSignup }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const credential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = credential.user;
      onSuccess({
        email: user.email || email,
        name:
          user.displayName || (user.email ? user.email.split("@")[0] : "User"),
      });
      toast({
        title: "Welcome back!",
        description: "Successfully logged in to AI Crop Planner",
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const credential = await signInWithPopup(auth, googleProvider);
      const user = credential.user;
      onSuccess({
        email: user.email || "unknown",
        name:
          user.displayName || (user.email ? user.email.split("@")[0] : "User"),
      });
      toast({
        title: "Welcome!",
        description: "Successfully logged in with Google",
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Google authentication failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-[var(--shadow-card)]">
      <CardHeader className="text-center space-y-4">
        <div className="mx-auto w-12 h-12 rounded-full flex items-center justify-center overflow-hidden bg-transparent">
          <img
            src="/favicon.jpeg"
            alt="App logo"
            className="h-12 w-12 object-contain"
          />
        </div>
        <div>
          <CardTitle className="text-2xl font-bold text-foreground">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Sign in to your AI Crop Planner account
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Button
          variant="outline"
          size="lg"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full border-2 hover:bg-accent"
        >
          <Chrome className="mr-2 h-5 w-5" />
          Continue with Google
        </Button>

        <div className="relative">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-sm text-muted-foreground">
            or
          </span>
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="farmer@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/90"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <button
            onClick={onSwitchToSignup}
            className="font-medium text-primary hover:underline focus:outline-none"
          >
            Sign up
          </button>
        </p>
      </CardContent>
    </Card>
  );
};
