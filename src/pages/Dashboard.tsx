// src/pages/Dashboard.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";

// NEW IMPORTS
import { auth, storage, db, Timestamp } from "@/config/firebaseConfig";
import { onAuthStateChanged, User } from "firebase/auth";
import { ref, uploadBytes } from "firebase/storage";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore"; // 'orderBy' is correctly imported now
import { Product } from "@/data/types"; // Import our REAL type

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [uploading, setUploading] = useState(false);

  // 1. REAL AUTH LISTENER
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
        navigate("/auth");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // 2. REAL FIRESTORE LISTENER for "My Products"
  useEffect(() => {
    if (!user) return; 

    const q = query(collection(db, "products"), where("artisanId", "==", user.uid), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const productsData: Product[] = [];
      querySnapshot.forEach((doc) => {
        productsData.push({ id: doc.id, ...doc.data() } as Product);
      });
      setMyProducts(productsData);
    });
    return () => unsubscribe();
  }, [user]); 

  // 3. REAL FILE UPLOAD HANDLER
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) return; 
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    
    // This is the file path your Cloud Function is waiting for
    const filePath = `products/${user.uid}/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, filePath);

    try {
      await uploadBytes(storageRef, file);
      toast({
        title: "Image uploaded! 🎨",
        description: "AI is analyzing your product. It will appear in 'My Products' shortly...",
      });
      // The Firestore listener will automatically update the page
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = () => {
    auth.signOut();
    navigate("/");
    toast({
      title: "Logged out",
      description: "See you next time!",
    });
  };

  if (!user) return null; // Loading state

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-primary">Artisan Hub</h1>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => navigate("/marketplace")}>
              Marketplace
            </Button>
            <Button variant="outline" onClick={() => navigate("/profile")}>
              My Profile
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-2">Welcome, {user.displayName || user.email}!</h2>
          <p className="text-muted-foreground">Upload your creations and let AI help tell their story</p>
        </div>

        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Upload New Product</CardTitle>
            <CardDescription>
              Upload a photo and our AI will analyze it to create a compelling product listing
            </CardDescription>
          </CardHeader> {/* <-- THIS WAS THE LINE WITH THE TYPO */}
          <CardContent>
            <div className="space-y-4">
              <Label htmlFor="product-image" className="cursor-pointer">
                <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary transition-colors">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG up to 10MB
                  </p>
                </div>
              </Label>
              <Input
                id="product-image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
                disabled={uploading}
              />
              {uploading && (
                <p className="text-sm text-center text-primary animate-pulse">
                  Uploading and processing with AI...
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <div>
          <h3 className="text-2xl font-bold mb-6">My Products</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myProducts.map((product) => (
              <Card key={product.id}>
                <div className="aspect-square overflow-hidden bg-muted">
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{product.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-foreground line-clamp-2">
                    {product.description}
                  </p>
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
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}