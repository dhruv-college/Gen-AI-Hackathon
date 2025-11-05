import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  MapPin, Globe, Instagram, Facebook, Verified, Edit, Briefcase, Star, Languages
} from "lucide-react";
import { auth, db } from "@/config/firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, setDoc, collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { type ArtisanProfile, type Product } from "@/data/types";
import { useLanguage } from "@/context/LanguageContext";

export interface FullArtisanProfile extends ArtisanProfile {
  translations?: {
    hi: { bio: string, headline: string };
    ta: { bio: string, headline: string };
  };
}

export default function Profile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentUser] = useAuthState(auth);
  
  const profileUserId = userId || currentUser?.uid;
  const isOwnProfile = profileUserId === currentUser?.uid;

  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<FullArtisanProfile | null>(null);
  const [userProducts, setUserProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    if (!profileUserId) return;
    
    setLoading(true);
    const profileDocRef = doc(db, "users", profileUserId);
    
    const unsubscribe = onSnapshot(profileDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setProfile({ id: docSnap.id, ...docSnap.data() } as FullArtisanProfile);
      } else if (isOwnProfile && currentUser) {
        setProfile({
          id: currentUser.uid,
          name: currentUser.displayName || "",
          headline: "",
          bio: "",
          profileImage: `https://api.dicebear.com/8.x/initials/svg?seed=${currentUser.displayName || 'Artisan'}`,
          coverImage: "",
          location: { city: "", country: "" },
          craftType: [],
          skills: [],
          languages: [],
          experience: "",
          verified: false,
          website: "",
          socialLinks: { instagram: "", facebook: "" }
        });
        setIsEditing(true);
      } else {
        toast({ title: "Profile not found", variant: "destructive" });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [profileUserId, isOwnProfile, currentUser]);

  useEffect(() => {
    if (!profileUserId) return;
    const q = query(collection(db, "products"), where("artisanId", "==", profileUserId), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const productsData: Product[] = [];
      querySnapshot.forEach((doc) => {
        productsData.push({ id: doc.id, ...doc.data() } as Product);
      });
      setUserProducts(productsData);
    });
    return () => unsubscribe();
  }, [profileUserId]);

  const handleSaveProfile = async () => {
    if (!profile) return;
    
    const { translations, ...profileToSave } = profile; 
    const profileDocRef = doc(db, "users", profile.id);
    
    try {
      await setDoc(profileDocRef, profileToSave, { merge: true });
      setIsEditing(false);
      toast({
        title: "Profile updated!",
        description: "Your changes have been saved successfully.",
      });
    } catch (error: any) {
      toast({ title: "Error saving profile", description: error.message, variant: "destructive" });
    }
  };
  
  const handleEdit = (field: string, value: string | string[]) => {
    if (profile) {
      setProfile({ ...profile, [field]: value });
    }
  };

  const handleEditLocation = (field: 'city' | 'country', value: string) => {
    if (profile) {
      setProfile({
        ...profile,
        location: { ...profile.location, [field]: value }
      });
    }
  };

  const getTranslatedContent = (field: 'headline' | 'bio') : string => {
    if (!profile) return "";
    
    if (language === 'hi' && profile.translations?.hi?.[field]) {
      return profile.translations.hi[field];
    }
    if (language === 'ta' && profile.translations?.ta?.[field]) {
      return profile.translations.ta[field];
    }
    
    return profile[field];
  };

  if (loading) return <div className="min-h-screen bg-background text-center p-12">Loading profile...</div>;
  if (!profile) return <div className="min-h-screen bg-background text-center p-12">User profile not found.</div>;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary cursor-pointer" onClick={() => navigate("/")}>Artisan Hub</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/marketplace")}>Marketplace</Button>
            {isOwnProfile && (<Button variant="outline" onClick={() => navigate("/dashboard")}>Dashboard</Button>)}
          </div>
        </div>
      </header>

      <div className="relative h-64 bg-muted">
        <img src={profile.coverImage || "https://images.unsplash.com/photo-1578894381163-e72c17f2d45a?q=80&w=2070&auto=format&fit=crop"} alt="Cover" className="w-full h-full object-cover" />
      </div>

      <div className="container mx-auto px-4">
        <div className="relative -mt-20 mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="relative">
              <img src={profile.profileImage} alt={profile.name} className="w-40 h-40 rounded-full border-4 border-card object-cover" />
              {profile.verified && (<div className="absolute bottom-2 right-2 bg-primary rounded-full p-2"><Verified className="w-6 h-6 text-primary-foreground fill-current" /></div>)}
            </div>

            <div className="flex-1 bg-card rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                {isEditing ? (
                  <div className="space-y-2 flex-1 mr-4">
                    <Label htmlFor="name">Name</Label>
                    <Input 
                      id="name" 
                      value={profile.name} 
                      onChange={(e) => handleEdit('name', e.target.value)} 
                      className="text-3xl font-bold"
                      placeholder="Your full name"
                    />
                    <Label htmlFor="headline">Headline</Label>
                    <Input 
                      id="headline" 
                      value={profile.headline} 
                      onChange={(e) => handleEdit('headline', e.target.value)} 
                      className="text-lg"
                      placeholder="e.g., Master Weaver, Ceramic Artist"
                    />
                  </div>
                ) : (
                  <div>
                    <h2 className="text-3xl font-bold mb-1">{profile.name || "Unnamed Artisan"}</h2>
                    <p className="text-lg text-muted-foreground mb-2">
                      {getTranslatedContent('headline') || "No headline yet"}
                    </p>
                  </div>
                )}
                {isOwnProfile && (
                  <Button variant="outline" size="sm" onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}>
                    <Edit className="w-4 h-4 mr-2" />
                    {isEditing ? "Save Profile" : "Edit Profile"}
                  </Button>
                )}
              </div>
              
              {isEditing ? (
                <div className="flex items-center gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input 
                      id="city" 
                      value={profile.location.city} 
                      onChange={(e) => handleEditLocation('city', e.target.value)} 
                      placeholder="Your city"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input 
                      id="country" 
                      value={profile.location.country} 
                      onChange={(e) => handleEditLocation('country', e.target.value)} 
                      placeholder="Your country"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience">Experience</Label>
                    <Input 
                      id="experience" 
                      value={profile.experience} 
                      onChange={(e) => handleEdit('experience', e.target.value)} 
                      placeholder="e.g., 5+ years"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  {(profile.location.city || profile.location.country) && (
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{profile.location.city}{profile.location.city && profile.location.country && ", "}{profile.location.country}</span>
                  )}
                  {profile.experience && (
                    <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" />{profile.experience}</span>
                  )}
                </div>
              )}

              {isEditing ? (
                 <div className="space-y-2 mt-4">
                    <Label htmlFor="craftType">Your Crafts (comma-separated)</Label>
                    <Input 
                      id="craftType" 
                      value={profile.craftType.join(', ')} 
                      onChange={(e) => handleEdit('craftType', e.target.value.split(',').map(s => s.trim()))} 
                      placeholder="e.g., Pottery, Weaving, Woodwork"
                    />
                  </div>
              ) : (
                <div className="flex flex-wrap gap-2 mb-4 mt-4">
                  {profile.craftType.length > 0 ? (
                    profile.craftType.map((craft) => (
                      <Badge key={craft} variant="secondary">{craft}</Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">No crafts added yet</span>
                  )}
                </div>
              )}

              {!isEditing && (
                <div className="flex items-center gap-2 mt-4 p-3 bg-muted/50 rounded-md">
                  <Languages className="w-4 h-4" />
                  <Label className="text-sm">View in:</Label>
                  <div className="flex gap-1">
                    <Button size="sm" variant={language === 'en' ? 'default' : 'outline'} onClick={() => setLanguage('en')}>EN</Button>
                    <Button size="sm" variant={language === 'hi' ? 'default' : 'outline'} onClick={() => setLanguage('hi')}>HI</Button>
                    <Button size="sm" variant={language === 'ta' ? 'default' : 'outline'} onClick={() => setLanguage('ta')}>TA</Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>About</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <Textarea
                    value={profile.bio}
                    onChange={(e) => handleEdit('bio', e.target.value)}
                    rows={6}
                    placeholder="Tell your story... How did you start your craft? What makes your work unique?"
                  />
                ) : (
                  <p className="text-sm text-foreground leading-relaxed">
                    {getTranslatedContent('bio') || "No bio added yet"}
                  </p>
                )}
              </CardContent>
            </Card>

            {isEditing ? (
              <Card>
                <CardHeader><CardTitle>Edit Details</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="skills">Skills (comma-separated)</Label>
                    <Input 
                      id="skills" 
                      value={profile.skills.join(', ')} 
                      onChange={(e) => handleEdit('skills', e.target.value.split(',').map(s => s.trim()))} 
                      placeholder="e.g., Glazing, Carving, Embroidery"
                    />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="languages">Languages (comma-separated)</Label>
                    <Input 
                      id="languages" 
                      value={profile.languages.join(', ')} 
                      onChange={(e) => handleEdit('languages', e.target.value.split(',').map(s => s.trim()))} 
                      placeholder="e.g., Tamil, Hindi, English"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input 
                      id="website" 
                      value={profile.website} 
                      onChange={(e) => handleEdit('website', e.target.value)} 
                      placeholder="https://yourportfolio.com" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram Username</Label>
                    <Input 
                      id="instagram" 
                      value={profile.socialLinks?.instagram} 
                      onChange={(e) => setProfile({...profile, socialLinks: {...profile.socialLinks, instagram: e.target.value}})} 
                      placeholder="your_handle" 
                    />
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                <Card>
                  <CardHeader><CardTitle>Skills & Expertise</CardTitle></CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.length > 0 ? (
                        profile.skills.map((skill) => (
                          <Badge key={skill} variant="outline"><Star className="w-3 h-3 mr-1" />{skill}</Badge>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">No skills added yet</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle>Languages</CardTitle></CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {profile.languages.length > 0 ? (
                        profile.languages.map((lang) => (
                          <Badge key={lang} variant="secondary">{lang}</Badge>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">No languages added yet</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle>Contact & Links</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    {profile.website && (<a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-primary hover:underline"><Globe className="w-4 h-4" />Website</a>)}
                    {profile.socialLinks?.instagram && (<a href={`https://instagram.com/${profile.socialLinks.instagram}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-primary hover:underline"><Instagram className="w-4 h-4" />{profile.socialLinks.instagram}</a>)}
                    {profile.socialLinks?.facebook && (<a href={`https://facebook.com/${profile.socialLinks.facebook}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-primary hover:underline"><Facebook className="w-4 h-4" />{profile.socialLinks.facebook}</a>)}
                    {!profile.website && !profile.socialLinks?.instagram && !profile.socialLinks?.facebook && (
                      <span className="text-sm text-muted-foreground">No contact links added yet</span>
                    )}
                  </CardContent>
                </Card>
              </>
            )}

            {isEditing && (
              <Button onClick={handleSaveProfile} className="w-full">
                Save Changes
              </Button>
            )}
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader><CardTitle>Portfolio</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {userProducts.length > 0 ? (
                    userProducts.map((product) => (
                      <div key={product.id} className="group cursor-pointer">
                        <div className="aspect-square overflow-hidden rounded-lg bg-muted mb-3">
                          <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        </div>
                        <h3 className="font-semibold mb-1">{product.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {product.hashtags?.slice(0, 3).map((tag) => (
                            <span key={tag} className="text-xs text-accent-foreground">{tag}</span>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-12">
                      <p className="text-muted-foreground">No products yet</p>
                      {isOwnProfile && (
                        <Button onClick={() => navigate("/dashboard")} className="mt-4">
                          Upload Your First Product
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}