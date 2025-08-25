import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Flame, Zap, ShoppingCart, Loader2 } from 'lucide-react';
import { PaymentModal } from '@/components/PaymentModal';
import { FadeInUp, ScaleIn } from '@/components/ScrollAnimations';
import { mealsApi, Meal } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';



export const MealsSection = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchFeaturedMeals = async () => {
      try {
        setLoading(true);
        const featuredMeals = await mealsApi.getFeatured();
        setMeals(featuredMeals);
      } catch (error) {
        console.error('Failed to fetch meals:', error);
        toast({
          title: 'Error',
          description: 'Failed to load meals. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedMeals();
  }, [toast]);

  const handleOrderClick = (meal: Meal) => {
    setSelectedMeal(meal);
  };

  if (loading) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading delicious meals...</p>
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
            <ScaleIn key={meal._id} delay={index * 0.2}>
              <Card className="group overflow-hidden border-0 shadow-card hover-glow">
              <div className="relative overflow-hidden">
                <img
                  src={meal.imageUrl}
                  alt={meal.name}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 space-y-2">
                  <div className="flex gap-2">
                    {meal.dietaryTags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs capitalize">
                        {tag.replace('-', ' ')}
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
                    <span className="font-medium">{meal.nutritionFacts.calories} cal</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Zap className="w-4 h-4 text-primary" />
                    <span className="font-medium">{meal.nutritionFacts.protein}g protein</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{meal.preparationTime} min</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4">
                  <div className="text-2xl font-bold text-primary">${meal.price}</div>
                  <Button 
                    variant="hero" 
                    size="sm"
                    onClick={() => handleOrderClick(meal)}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Order Now
                  </Button>
                </div>
              </div>
              </Card>
            </ScaleIn>
          ))}
        </div>
        
        <PaymentModal
          isOpen={!!selectedMeal}
          onClose={() => setSelectedMeal(null)}
          mealTitle={selectedMeal?.name || ''}
          price={selectedMeal?.price.toString() || ''}
        />
      </div>
    </section>
  );
};