// src/pages/Marketplace.tsx
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { auth, db } from "@/config/firebaseConfig";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { Product } from "@/data/types";
import { Volume2 } from "lucide-react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useLanguage } from "@/context/LanguageContext";
import TranslationDebug from '@/components/TranslationDebug';

// In Marketplace.tsx - REPLACE the getTranslatedDescription function
function ProductCard({ product }: { product: Product }) {
  const navigate = useNavigate();
  const { language } = useLanguage();

  // 🔥 FIXED: Dynamic translation based on current language
  const getTranslatedDescription = () => {
    console.log('🌐 Current language:', language); // Debug log
    console.log('📦 Available translations:', product.translations); // Debug log
    
    // Check if translation exists for current language
    if (product.translations && product.translations[language as keyof typeof product.translations]) {
      return product.translations[language as keyof typeof product.translations];
    }
    
    // Fallback to English
    return product.description;
  };

  // Remove audio part for now
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardHeader>
        <CardTitle className="text-xl">{product.title}</CardTitle>
        <CardDescription 
          className="text-sm text-muted-foreground cursor-pointer hover:underline"
          onClick={() => navigate(`/profile/${product.artisanId}`)}
        >
          by Artisan {product.artisanId.substring(0, 6)}... 
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 flex-grow flex flex-col justify-between">
        <p className="text-sm text-foreground line-clamp-3">
          {getTranslatedDescription()}
        </p>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex flex-wrap gap-2">
              {product.hashtags?.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-accent/20 text-accent-foreground px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            {/* 🔥 REMOVED AUDIO BUTTON FOR NOW */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// 🔥 NEW: AI Recommendation Function - Add this right before your main component
const getRecommendedProducts = (products: Product[]): Product[] => {
  // Simple AI-like recommendation logic
  // In a real app, this would call your Gemini API
  return products
    .sort(() => Math.random() - 0.5) // Shuffle for variety
    .slice(0, 3); // Show 3 recommendations
};

// Your main Marketplace component
export default function Marketplace() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [user] = useAuthState(auth);
  const { language,setLanguage } = useLanguage();

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const productsData: Product[] = [];
      querySnapshot.forEach((doc) => {
        productsData.push({ id: doc.id, ...doc.data() } as Product);
      });
      setProducts(productsData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-primary">Artisan Hub</h1>
          <div className="flex gap-2 items-center">
                <Button size="sm" 
                  variant={language === 'en' ? 'default' : 'ghost'} 
                  onClick={() => setLanguage('en')}
                >
                  EN
                </Button>
                <Button 
                  size="sm" 
                  variant={language === 'hi' ? 'default' : 'ghost'} 
                  onClick={() => setLanguage('hi')}
                >
                  HI
                </Button>
                <Button 
                  size="sm" 
                  variant={language === 'ta' ? 'default' : 'ghost'} 
                  onClick={() => setLanguage('ta')}
                >
                  TA
                </Button>
            <div className="border-l h-6 mx-2"></div> 
            
            {user ? (
              <Button variant="outline" onClick={() => navigate("/dashboard")}>
                My Dashboard
              </Button>
            ) : (
              <Button onClick={() => navigate("/auth")}>Sign In</Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Discover Handcrafted Treasures</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Every piece tells a story. Connect with local artisans and bring authentic craftsmanship into your home.
          </p>
        </div>
        
        {/* 🔥 NEW: AI Recommendations Section - Add this right here */}
        {products.length > 3 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="text-primary">✨ AI Recommended For You</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {getRecommendedProducts(products).map((product) => (
                <ProductCard key={`recommended-${product.id}`} product={product} />
              ))}
            </div>
          </div>
        )}
        
        {/* Your existing products grid */}
        {loading ? (
          <p className="text-center">Loading treasures...</p>
        ) : (
          <>
            <h3 className="text-2xl font-bold mb-6">All Products</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                  <div key={product.id}>
                    <TranslationDebug data={product} type="product" />
                    <ProductCard product={product} />
                  </div>
                ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}