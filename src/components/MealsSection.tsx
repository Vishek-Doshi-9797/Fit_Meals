import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Flame, Zap, ShoppingCart } from 'lucide-react';
import { FadeInUp, ScaleIn } from '@/components/ScrollAnimations';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface Meal {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  calories: number;
  protein_content: number;
  category: string;
  ingredients: string[];
}

export const MealsSection = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addItem } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    try {
      const { data, error } = await supabase
        .from('meals')
        .select('*')
        .eq('is_available', true)
        .order('category', { ascending: true });

      if (error) throw error;
      setMeals(data || []);
    } catch (error) {
      console.error('Error fetching meals:', error);
      toast({
        title: "Failed to load meals",
        description: "Please refresh the page to try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = (meal: Meal) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to your cart.",
        action: (
          <Button variant="outline" onClick={() => navigate('/auth')}>
            Sign In
          </Button>
        ),
      });
      return;
    }

    addItem({
      id: meal.id,
      name: meal.name,
      price: meal.price / 100, // Convert from paise to rupees for display
      image_url: meal.image_url,
    });

    toast({
      title: "Added to cart! 🛒",
      description: `${meal.name} has been added to your cart.`,
    });
  };

  const formatPrice = (price: number) => {
    return `₹${(price / 100).toFixed(0)}`;
  };

  const getCategoryTags = (category: string) => {
    switch (category) {
      case 'shake':
        return ['High Protein', 'Pre/Post Workout'];
      case 'sandwich':
        return ['Muscle Building', 'Fresh'];
      case 'bowl':
        return ['Recovery', 'Antioxidants'];
      default:
        return ['Healthy', 'Nutritious'];
    }
  };

  if (isLoading) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading delicious meals...</p>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <FadeInUp>
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-5xl font-bold">
              Our <span className="gradient-text">Fit Meals</span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Protein shakes, healthy sandwiches, and power bowls for maximum nutrition and taste.
            </p>
          </div>
        </FadeInUp>

        <div className="grid md:grid-cols-3 gap-8">
          {meals.map((meal, index) => (
            <ScaleIn key={meal.id} delay={index * 0.2}>
              <Card className="group overflow-hidden border-0 shadow-card hover-glow">
                <div className="relative overflow-hidden">
                  <img
                    src={meal.image_url}
                    alt={meal.name}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 space-y-2">
                    <div className="flex gap-2">
                      {getCategoryTags(meal.category).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <h3 className="text-2xl font-bold">{meal.name}</h3>
                  <p className="text-muted-foreground leading-relaxed">{meal.description}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <div className="flex items-center gap-1 text-sm">
                      <Flame className="w-4 h-4 text-secondary" />
                      <span className="font-medium">{meal.calories} cal</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Zap className="w-4 h-4 text-primary" />
                      <span className="font-medium">{meal.protein_content}g protein</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">Ready to eat</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4">
                    <div className="text-2xl font-bold text-primary">{formatPrice(meal.price)}</div>
                    <Button 
                      variant="hero" 
                      size="sm"
                      onClick={() => handleAddToCart(meal)}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </Card>
            </ScaleIn>
          ))}
        </div>
      </div>
    </section>
  );
};