import { useLanguage } from "@/context/LanguageContext";

export default function LoadingScreen() {
  const { getLanguageName, language } = useLanguage();
  
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-lg font-medium">
          Customizing Artisan Hub for you...
        </p>
        <p className="text-sm text-muted-foreground">
          Switching to {getLanguageName(language)}
        </p>
      </div>
    </div>
  );
}