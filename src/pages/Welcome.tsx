// src/pages/Welcome.tsx
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage, AppLanguages } from "@/context/LanguageContext"; // <-- USE THE BRAIN
import LoadingScreen from "@/components/LoadingScreen"; // 🔥 ADD THIS IMPORT

export default function Welcome() {
  const navigate = useNavigate();
  const { language, setLanguage,translatePage, isTranslating} = useLanguage(); // Get the language state

  const handleContinue = async() => {
    await translatePage(language); // 🔥 ADD THIS LINE - Start translation
    // Send them to their profile to fill it out
    navigate("/profile"); 
  };
  if (isTranslating) {
    return <LoadingScreen />; // 🔥 SHOW LOADING SCREEN WHEN TRANSLATING
  }
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg text-center">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Welcome to Artisan Hub!</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Please select your preferred language to continue.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 p-6">
          <Select onValueChange={setLanguage} defaultValue={language} disabled={isTranslating}>
            <SelectTrigger className="w-full text-lg p-6">
              <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(AppLanguages).map(([code, name]) => (
                <SelectItem key={code} value={code} className="text-lg">
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            size="lg" 
            className="w-full text-lg" 
            onClick={handleContinue}
            disabled={isTranslating} // 🔥 ADD disabled prop
          >
            {isTranslating ? "Please wait..." : "Continue"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}