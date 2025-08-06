import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Flame, Zap } from 'lucide-react';
import breakfastHero from '@/assets/breakfast-hero.jpg';
import lunchBowl from '@/assets/lunch-bowl.jpg';
import dinnerPlate from '@/assets/dinner-plate.jpg';

const meals = [
  {
    title: 'Breakfast',
    description: 'High-protein oats, Greek yogurt and berries. Perfect jumpstart!',
    image: breakfastHero,
    calories: '520 cal',
    protein: '28g protein',
    time: '5 min prep',
    tags: ['High Protein', 'Quick'],
  },
  {
    title: 'Lunch', 
    description: 'Grilled chicken, buddha bowl style with quinoa, roasted veggies & healthy fats.',
    image: lunchBowl,
    calories: '680 cal',
    protein: '42g protein', 
    time: 'Ready to eat',
    tags: ['Balanced', 'Fresh'],
  },
  {
    title: 'Dinner',
    description: 'Macro-perfect dinner: lean beef stir-fry, broccoli & sweet potato for ideal recovery.',
    image: dinnerPlate,
    calories: '750 cal',
    protein: '45g protein',
    time: 'Ready to eat', 
    tags: ['Recovery', 'Macro Perfect'],
  },
];

export const MealsSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-bold">
            Sample <span className="gradient-text">Meals</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Breakfast, lunch, and dinner options for maximum nutrition and taste.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {meals.map((meal, index) => (
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
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};