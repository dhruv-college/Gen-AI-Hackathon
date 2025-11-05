// Create: src/components/TranslationDebug.tsx
import { useLanguage } from '@/context/LanguageContext';

export default function TranslationDebug({ data, type }: { data: any, type: string }) {
  const { language } = useLanguage();
  
  console.log(`🔍 ${type} Debug:`, {
    currentLanguage: language,
    availableTranslations: data?.translations,
    originalText: type === 'product' ? data?.description : data?.bio
  });
  
  return null; // This doesn't render anything, just logs
}