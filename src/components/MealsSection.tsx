import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Flame, Zap, ShoppingCart } from 'lucide-react';
import { PaymentModal } from '@/components/PaymentModal';
import { FadeInUp, ScaleIn } from '@/components/ScrollAnimations';
import proteinShake from '@/assets/protein-shake.jpg';
import healthySandwich from '@/assets/healthy-sandwich.jpg';
import acaiBowl from '@/assets/acai-bowl.jpg';

const meals = [
  {
    title: 'Power Protein Shake',
    description: 'Green protein smoothie with spinach, banana, whey protein, and berries. Perfect pre/post workout fuel!',
    image: proteinShake,
    calories: '420 cal',
    protein: '35g protein',
    time: '2 min prep',
    price: '₹299',
    tags: ['High Protein', 'Pre/Post Workout'],
  },
  {
    title: 'Fit Chicken Sandwich', 
    description: 'Grilled chicken avocado sandwich on whole grain bread with fresh vegetables. Perfect muscle-building meal.',
    image: healthySandwich,
    calories: '580 cal',
    protein: '38g protein', 
    time: 'Ready to eat',
    price: '₹399',
    tags: ['Muscle Building', 'Fresh'],
  },
  {
    title: 'Acai Power Bowl',
    description: 'Antioxidant-rich acai bowl with granola, fresh berries, coconut flakes and protein powder. Perfect recovery meal.',
    image: acaiBowl,
    calories: '485 cal',
    protein: '25g protein',
    time: 'Ready to eat',
    price: '₹449',
    tags: ['Recovery', 'Antioxidants'],
  },
];

export const MealsSection = () => {
  const [selectedMeal, setSelectedMeal] = useState<{ title: string; price: string } | null>(null);

  const handleOrderClick = (meal: { title: string; price: string }) => {
    setSelectedMeal(meal);
  };
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
            <ScaleIn delay={index * 0.2}>
              <Card key={index} className="group overflow-hidden border-0 shadow-card hover-glow">
              <div className="relative overflow-hidden">
                <img
                  src={meal.image}
                  alt={meal.title}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 space-y-2">
                  <div className="flex gap-2">
                    {meal.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <h3 className="text-2xl font-bold">{meal.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{meal.description}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <div className="flex items-center gap-1 text-sm">
                    <Flame className="w-4 h-4 text-secondary" />
                    <span className="font-medium">{meal.calories}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Zap className="w-4 h-4 text-primary" />
                    <span className="font-medium">{meal.protein}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{meal.time}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4">
                  <div className="text-2xl font-bold text-primary">{meal.price}</div>
                  <Button 
                    variant="hero" 
                    size="sm"
                    onClick={() => handleOrderClick({ title: meal.title, price: meal.price })}
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
          mealTitle={selectedMeal?.title || ''}
          price={selectedMeal?.price || ''}
        />
      </div>
    </section>
  );
};