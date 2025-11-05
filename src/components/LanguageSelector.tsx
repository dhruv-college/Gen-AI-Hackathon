import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Languages, Volume2 } from "lucide-react";
import { SUPPORTED_LANGUAGES, type LanguageCode } from "@/services/translationService";
import { speak, LANGUAGE_CODE_MAP } from "@/services/textToSpeechService";
import { useToast } from "@/hooks/use-toast";

interface LanguageSelectorProps {
  onLanguageSelect: (language: LanguageCode) => void;
}

export default function LanguageSelector({ onLanguageSelect }: LanguageSelectorProps) {
  const [selectedLang, setSelectedLang] = useState<LanguageCode>("en");
  const [playingLang, setPlayingLang] = useState<LanguageCode | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Auto-play welcome message in English
    const welcomeMessage = "Welcome to Artisan Hub. Please select your preferred language to continue.";
    speak(welcomeMessage, "en-IN").catch(() => {
      // Silently fail if TTS is not configured
    });
  }, []);

  const handleLanguagePreview = async (langCode: LanguageCode) => {
    setPlayingLang(langCode);
    try {
      const previewTexts: Record<string, string> = {
        en: "Welcome to Artisan Hub. This platform connects artisans with customers.",
        hi: "आर्टिजन हब में आपका स्वागत है। यह मंच कारीगरों को ग्राहकों से जोड़ता है।",
        bn: "আর্টিজান হাবে স্বাগতম। এই প্ল্যাটফর্ম কারিগরদের গ্রাহকদের সাথে সংযুক্ত করে।",
        te: "ఆర్టిజన్ హబ్‌కు స్వాగతం. ఈ వేదిక కళాకారులను కస్టమర్లతో కనెక్ట్ చేస్తుంది.",
        mr: "आर्टिजन हबमध्ये आपले स्वागत आहे. हे व्यासपीठ कारागीरांना ग्राहकांशी जोडते.",
        ta: "ஆர்டிசன் ஹப்பிற்கு வரவேற்கிறோம். இந்த தளம் கைவினைஞர்களை வாடிக்கையாளர்களுடன் இணைக்கிறது.",
        gu: "આર્ટિઝન હબમાં આપનું સ્વાગત છે. આ પ્લેટફોર્મ કારીગરોને ગ્રાહકો સાથે જોડે છે.",
        kn: "ಆರ್ಟಿಸನ್ ಹಬ್‌ಗೆ ಸುಸ್ವಾಗತ. ಈ ವೇದಿಕೆಯು ಕುಶಲಕರ್ಮಿಗಳನ್ನು ಗ್ರಾಹಕರೊಂದಿಗೆ ಸಂಪರ್ಕಿಸುತ್ತದೆ.",
        ml: "ആർട്ടിസൻ ഹബിലേക്ക് സ്വാഗതം. ഈ പ്ലാറ്റ്ഫോം കരകൗശല വിദഗ്ധരെ ഉപഭോക്താക്കളുമായി ബന്ധിപ്പിക്കുന്നു.",
        pa: "ਆਰਟੀਜ਼ਨ ਹੱਬ ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ। ਇਹ ਪਲੇਟਫਾਰਮ ਕਾਰੀਗਰਾਂ ਨੂੰ ਗ੍ਰਾਹਕਾਂ ਨਾਲ ਜੋੜਦਾ ਹੈ।",
        ur: "آرٹیزن ہب میں خوش آمدید۔ یہ پلیٹ فارم دستکاروں کو صارفین سے جوڑتا ہے۔",
      };

      const text = previewTexts[langCode] || previewTexts.en;
      const ttsLangCode = LANGUAGE_CODE_MAP[langCode] || "en-IN";
      
      await speak(text, ttsLangCode);
    } catch (error) {
      toast({
        title: "Voice preview unavailable",
        description: "Please configure Google Cloud Text-to-Speech API",
        variant: "destructive",
      });
    } finally {
      setPlayingLang(null);
    }
  };

  const handleContinue = () => {
    onLanguageSelect(selectedLang);
    
    // Speak confirmation
    const confirmTexts: Record<string, string> = {
      en: "Language selected. Let me guide you through the platform.",
      hi: "भाषा चुनी गई। मैं आपको प्लेटफ़ॉर्म के बारे में बताऊंगा।",
      bn: "ভাষা নির্বাচিত। আমি আপনাকে প্ল্যাটফর্মের মাধ্যমে গাইড করব।",
      te: "భాష ఎంపిక చేయబడింది. నేను మీకు ప్లాట్‌ఫారమ్ ద్వారా మార్గనిర్దేశం చేస్తాను.",
      mr: "भाषा निवडली. मी तुम्हाला प्लॅटफॉर्मद्वारे मार्गदर्शन करतो.",
      ta: "மொழி தேர்ந்தெடுக்கப்பட்டது. நான் உங்களுக்கு தளத்தை வழிநடத்துகிறேன்.",
    };

    const text = confirmTexts[selectedLang] || confirmTexts.en;
    const ttsLangCode = LANGUAGE_CODE_MAP[selectedLang] || "en-IN";
    speak(text, ttsLangCode).catch(() => {});
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background p-4">
      <Card className="w-full max-w-3xl shadow-xl">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-primary/10 rounded-full">
              <Languages className="w-12 h-12 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl">Welcome to Artisan Hub</CardTitle>
          <CardDescription className="text-lg">
            Select your preferred language to get started
            <br />
            अपनी पसंदीदा भाषा चुनें
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(SUPPORTED_LANGUAGES).map(([code, name]) => (
              <Button
                key={code}
                variant={selectedLang === code ? "default" : "outline"}
                className="h-auto py-4 px-3 flex flex-col gap-2 relative"
                onClick={() => setSelectedLang(code as LanguageCode)}
              >
                <span className="text-sm font-semibold">{name}</span>
                <button
                  className="absolute top-2 right-2 p-1 hover:bg-accent rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLanguagePreview(code as LanguageCode);
                  }}
                  disabled={playingLang === code}
                >
                  <Volume2 className={`w-4 h-4 ${playingLang === code ? 'animate-pulse text-primary' : ''}`} />
                </button>
              </Button>
            ))}
          </div>

          <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              Click the speaker icon to hear the language
            </p>
          </div>

          <Button
            size="lg"
            className="w-full text-lg py-6"
            onClick={handleContinue}
          >
            Continue • जारी रखें • চালিয়ে যান
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
