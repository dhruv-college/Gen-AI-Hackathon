// src/pages/Auth.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

// Import the real Firebase auth service
import { auth } from "@/config/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from "firebase/auth";

// We have removed all broken imports to "textToSpeechService" and "translationService"

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      // Real Firebase Login
      try {
        await signInWithEmailAndPassword(auth, email, password);
        toast({
          title: "Login successful!",
          description: "Welcome back to Artisan Hub",
        });
        navigate("/Welcome");
      } catch (error: any) {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
      }
    } else {
      // Real Firebase Signup
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Set the user's display name
        await updateProfile(userCredential.user, { displayName: name });
        
        toast({
          title: "Account created!",
          description: "Welcome to Artisan Hub",
        });
        navigate("/Welcome");
      } catch (error: any) {
        toast({
          title: "Signup failed",
          description: error.message,
          variant: "destructive",
        });
      }
    }
    setLoading(false);
  };

  // All the 'speak' and 'language' functions have been removed to fix the errors.

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center">
            Artisan Hub
          </CardTitle>
          <CardDescription className="text-center">
            {isLogin ? "Welcome back to your creative space" : "Join our community of artisans"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Your artisan name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:underline"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}