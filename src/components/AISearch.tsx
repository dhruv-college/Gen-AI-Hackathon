// src/components/AISearch.tsx
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Sparkles } from "lucide-react";

export default function AISearch({ onSearch }: { onSearch: (query: string) => void }) {
  const [query, setQuery] = useState("");

  const handleAISearch = () => {
    // Enhance search with AI understanding
    const enhancedQuery = enhanceSearchQuery(query);
    onSearch(enhancedQuery);
  };

  const enhanceSearchQuery = (searchText: string): string => {
    // Simple AI enhancement - in real app, use NLP
    const enhancements: Record<string, string> = {
      "home decor": "home decor pottery textiles wall art",
      "jewelry": "jewelry necklace bracelet earrings handmade",
      "gifts": "gifts personalized custom handmade unique",
      "wedding": "wedding gifts decor traditional ceremonial"
    };

    const lowerText = searchText.toLowerCase();
    for (const [key, value] of Object.entries(enhancements)) {
      if (lowerText.includes(key)) {
        return `${searchText} ${value}`;
      }
    }
    return searchText;
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ask AI: 'Find pottery for home decor' or 'Traditional wedding gifts'..."
        className="pl-10 pr-24 py-6 text-lg"
        onKeyPress={(e) => e.key === 'Enter' && handleAISearch()}
      />
      <Button 
        onClick={handleAISearch}
        className="absolute right-2 top-2"
      >
        <Sparkles className="w-4 h-4 mr-2" />
        AI Search
      </Button>
    </div>
  );
}