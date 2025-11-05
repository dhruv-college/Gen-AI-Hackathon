import { functions } from "@/config/firebaseConfig";
import { httpsCallable } from "firebase/functions";

interface TranslationResponse {
  success: boolean;
  translations: string[];
  targetLanguage: string;
}

export class WebsiteTranslator {
  private cache = new Map<string, string>();

  async translateWebsite(targetLanguage: string): Promise<boolean> {
    try {
      // 1. Collect all text nodes from the website
      const texts = this.collectAllTexts();
      if (texts.length === 0) return true;

      // 2. Call Cloud Function for translation
      const translateFunction = httpsCallable(functions, 'translateWebsite');
      const result = await translateFunction({
        texts: texts,
        targetLanguage: targetLanguage
      });

      // 3. Apply translations to the website
      const response = result.data as TranslationResponse; // 🔥 USE THE INTERFACE
      this.applyTranslations(texts, response.translations);
      
      return true;

    } catch (error) {
      console.error('Website translation failed:', error);
      return false;
    }
  }

  private collectAllTexts(): string[] {
    const texts: string[] = [];
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          // Skip empty text, script tags, and already translated text
          if (!node.textContent?.trim() || 
              node.parentElement?.tagName === 'SCRIPT' ||
              node.parentElement?.tagName === 'STYLE') {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    let node;
    while (node = walker.nextNode()) {
      if (node.textContent && node.textContent.trim().length > 0) {
        texts.push(node.textContent);
      }
    }

    return texts;
  }

  private applyTranslations(originalTexts: string[], translations: string[]) {
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          if (!node.textContent?.trim()) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    let index = 0;
    let node;

    while (node = walker.nextNode()) {
      if (index < translations.length && node.textContent) {
        node.textContent = translations[index];
        index++;
      }
    }
  }
}

export const websiteTranslator = new WebsiteTranslator();