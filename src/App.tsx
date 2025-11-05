// src/App.tsx
import { useState } from "react"; // <-- ADD THIS IMPORT
import { useLanguage } from "@/context/LanguageContext"; // 🔥 ADD THIS IMPORT
import LoadingScreen from "@/components/LoadingScreen"; // 🔥 ADD THIS IMPORT
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import Welcome from "./pages/Welcome";
import Marketplace from "./pages/Marketplace";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import { Button } from "@/components/ui/button"; // <-- ADD THIS IMPORT
import { Bot } from "lucide-react"; // <-- ADD THIS IMPORT

// 🔥 NEW: Import the AI Chat Assistant
import AIChatAssistant from "./components/AIChatAssistant";

const queryClient = new QueryClient();

// 🔥 NEW: Floating Chat Component - Add this before your main App
function FloatingChat() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      {isChatOpen && (
        <div className="fixed bottom-20 right-4 z-50">
          <AIChatAssistant />
        </div>
      )}
      <Button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-4 right-4 w-12 h-12 rounded-full shadow-lg z-50"
        size="icon"
      >
        <Bot className="w-5 h-5" />
      </Button>
    </>
  );
}

// Your main App component
const App = () => {
  const { isTranslating } = useLanguage(); // 🔥 ADD THIS HOOK
  
  // 🔥 ADD THIS CHECK FOR GLOBAL LOADING
  if (isTranslating) {
    return <LoadingScreen />;
  }

  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Marketplace />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/welcome" element={<Welcome />} /> 
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:userId" element={<Profile />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        
        {/* 🔥 ADD THIS LINE - Floating Chat appears on ALL pages */}
        <FloatingChat />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
 );
};
export default App;